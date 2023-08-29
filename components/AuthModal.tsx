"use client";

import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import useAuthModal from "@/hooks/useAuthModal";

import Modal from "./Modal";
import { useEffect } from "react";

export default function AuthModal() {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const {session} = useSessionContext();
    const {onClose, isOpen} = useAuthModal();

    useEffect(() => {
        if(session){
            router.refresh();
            onClose();
        }
    
    }, [session, router, onClose])
    

    const onChange = (open: boolean) => {
        if(!open) onClose();
    }

    return (
        <Modal title='Welcome back'
            description='Login to your account'
            isOpen={isOpen}
            onChange={onChange}
        >
            <Auth
                theme="dark"
                magicLink
                providers={['google', 'github']}
                supabaseClient={supabaseClient}
                appearance={{
                    theme: ThemeSupa
                }}
            />
        </Modal>
    )
}
