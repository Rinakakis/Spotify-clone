"use client";

import qs from "query-string";
import useDebounce from '@/hooks/useDebounce';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Input from "./Input";

export default function SearchInput() {

    const router = useRouter();
    const [value, setValue] = useState("");
    const deabounceValue = useDebounce(value, 500);

    useEffect(()=>{
        const query = {
            title: deabounceValue,
        };

        const url = qs.stringifyUrl({
            url: '/search',
            query: query
        });

        router.push(url);
    }, [deabounceValue, router])

    return (
        <Input
            placeholder="What do you want to listen to?"
            value={value}
            onChange={(e)=> setValue(e.target.value)}
        />
    )
}
