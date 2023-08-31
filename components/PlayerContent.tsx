"use client";

import { Song } from "@/types";
import { BsPauseFill, BsPlayFill } from "react-icons/bs"
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerXMark, HiMiniSpeakerWave } from "react-icons/hi2";
import { useEffect, useState } from "react";

import usePlayer from "@/hooks/usePlayer";
import Slider from "./Slider";
import MediaItem from "./MediaItem";
import LikedButton from "./LikedButton";
import useSound from "use-sound";

interface PlayerContentProps {
    song: Song;
    songUrl: string;
}

export default function PlayerContent({ song, songUrl }: PlayerContentProps) {

    const player = usePlayer();
    const [volume, setVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);

    const Icon = isPlaying ? BsPauseFill : BsPlayFill;
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiMiniSpeakerWave;

    const onPlayNext = () => {
        if (player.ids.length === 0) return;

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const nextSong = player.ids[currentIndex + 1];

        if (!nextSong) {
            return player.setId(player.ids[0]);
        }
        player.setId(nextSong);
    };

    const onPlayPrev = () => {
        if (player.ids.length === 0) return;

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const prevSong = player.ids[currentIndex - 1];

        if (!prevSong) {
            return player.setId(player.ids[player.ids.length - 1]);
        }
        player.setId(prevSong);
    };

    const [play, { pause, sound }] = useSound(
        songUrl,
        {
            volume: volume,
            onplay: () => setIsPlaying(true),
            onend: () => {
                setIsPlaying(false)
                onPlayNext();
            },
            onpause: () => setIsPlaying(false),
            format: ['mp3']
        }
    );

    useEffect(() => {
        sound?.play();
        return () => {
            sound?.unload();
        }
    }, [sound]);

    const handlePlay = () => {
        if(!isPlaying) play();
        else pause();    
    };

    const tongleMute = () => {
        if(volume === 0) setVolume(1);
        else setVolume(0);    
    };


    return (

        <div className="grid grid-cols-2 md:grid-cols-3 h-full">
            <div className="flex w-full justify-start">
                <div className="flex items-center gap-x-4">
                    <MediaItem data={song} />
                    <LikedButton songId={song.id} />
                </div>
            </div>

            <div className="flex md:hidden col-auto w-full justify-end items-center">
                <div
                    onClick={handlePlay}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer"
                >
                    <Icon className="text-black" size={30} />
                </div>
            </div>

            <div className="hidden h-full md:flex justify-center items-center w-full max-w-[772px] gap-x-6">
                <AiFillStepBackward
                    className="text-neutral-400 cursor-pointer hover:text-white transition"
                    size={30}
                    onClick={onPlayPrev}
                />
                <div
                    className="flex justify-center items-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer"
                    onClick={handlePlay}
                >
                    <Icon className="text-black" size={30} />
                </div>
                <AiFillStepForward
                    className="text-neutral-400 cursor-pointer hover:text-white transition"
                    size={30}
                    onClick={onPlayNext}
                />
            </div>

            <div className="hidden md:flex w-full justify-end pr-2">
                <div className="flex items-center gap-x-2 w-[120px]">
                    <VolumeIcon
                        onClick={tongleMute}
                        size={30}
                        className="cursor-pointer"
                    />
                    <Slider 
                        value={volume}
                        onChange={(value) => setVolume(value)}
                    />
                </div>
            </div>

        </div>
    )
}
