import { time } from "console";
import { useEffect, useState } from "react";


export default function useDebounce<T>(value: T, dealy?:number): T {
    const [debounceValue, setDeabounceValue] = useState(value);

    useEffect(()=>{
        const timer = setTimeout(()=>{
            setDeabounceValue(value)
        }, dealy || 500);

        return () => {
            clearTimeout(timer)
        }
    }, [value, dealy]);

    return debounceValue;
};
