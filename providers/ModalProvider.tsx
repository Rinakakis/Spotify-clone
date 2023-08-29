"use client";

import React, { useEffect, useState } from 'react'

import AuthModal from '@/components/AuthModal';
import UploadModal from '@/components/UploadModal';

export default function ModalProvider() {
    const [isMounted,setIsMounted] = useState(false);

    useEffect(() => { // If this loads that means we are on the client
        setIsMounted(true);
    }, [])
    
    if(!isMounted) return null;

    return (
    <>
        <AuthModal/>
        <UploadModal/>
    </>
    )
}
