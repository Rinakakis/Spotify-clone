"use client";

import React, { use, useState } from 'react'
import useUploadModal from '@/hooks/useUploadModal';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Input from './Input';
import Button from './Button';
import { toast } from 'react-hot-toast';
import uniqid from 'uniqid';
import { useUser } from '@/hooks/useUser';
import Modal from './Modal'
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { error } from 'console';
import { useRouter } from 'next/navigation';

export default function UploadModal() {

    const [isLoading, setIsLoading] = useState(false);
    const { onClose, isOpen } = useUploadModal();
    const { user } = useUser();
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    const { register, handleSubmit, reset } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            song: null,
            image: null,
        }
    })

    const onChange = (open: boolean) => {
        if (!open) {
            reset(); //reset form
            onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true);
            const imageFile = values.image?.[0];
            const songFile = values.song?.[0];

            if (!imageFile || !songFile || !user) {
                toast.error('Missing fields');
                return;
            }

            const uniqID = uniqid();
            const {
                data: songData,
                error: songError
            } = await supabaseClient
                .storage.from('songs').upload(`song-${values.title}-${uniqID}`,
                songFile,{
                    cacheControl: '3600',
                    upsert: false
                }
            );

            if(songError) {
                setIsLoading(false) 
                return toast.error('Failed to upload song');
            }

            const {
                data: imageData,
                error: imageError
            } = await supabaseClient
                .storage.from('images').upload(`image-${values.title}-${uniqID}`,
                imageFile,{
                    cacheControl: '3600',
                    upsert: false
                }
            );

            if(imageError) {
                setIsLoading(false) 
                return toast.error('Failed to upload image');
            }

            
            const { error: supaBaseError } = await supabaseClient
            .from('songs')
            .insert({ 
                user_id: user.id,
                title: values.title,
                author: values.author,
                image_path: imageData.path,
                song_path: songData.path
            });

            if(supaBaseError)
                return toast.error(supaBaseError.message);

            router.refresh();
            setIsLoading(false);
            toast.success('Song Uploaded!');
            reset();
            onClose();
        } catch (error) {
            toast.error('Something went wrogn')
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal
            title='Add a song'
            description='Upload an mp3 file'
            onChange={onChange}
            isOpen={isOpen}
        >
            <form
                className='flex flex-col gap-y-4'
                onSubmit={handleSubmit(onSubmit)}
            >
                <Input
                    id='title'
                    disabled={isLoading}
                    {...register('title', { required: true })}
                    placeholder='Song title'
                />
                <Input
                    id='author'
                    disabled={isLoading}
                    {...register('author', { required: true })}
                    placeholder='Song author'
                />
                <div>
                    <div className='pb-1'>
                        Select a song file
                    </div>
                    <Input
                        id='song'
                        type='file'
                        disabled={isLoading}
                        accept='.mp3'
                        {...register('song', { required: true })}
                    />
                </div>
                <div>
                    <div className='pb-1'>
                        Select a song image
                    </div>
                    <Input
                        id='image'
                        type='file'
                        disabled={isLoading}
                        accept='image/*'
                        {...register('image', { required: true })}
                    />
                </div>
                <Button disabled={isLoading} type='submit'>
                    Create
                </Button>
            </form>
        </Modal>
    )
}
