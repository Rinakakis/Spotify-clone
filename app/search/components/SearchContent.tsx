"use client";

import LikedButton from "@/components/LikedButton";
import MediaItem from "@/components/MediaItem";
import { Song } from "@/types";

interface SearchContentProps {
    songs: Song[];
}
export default function SearchContent({songs}: SearchContentProps) {

    if(songs.length === 0) 
        return (
            <div className="flex flex-col gap-y-2 w-full items-center justify-center text-2xl">
                No songs found
            </div>
        )
        
    return (
        <div className="flex flex-col gap-y-2 w-full px-6 ">
            {
                songs.map((song)=>(
                    <div 
                        key={song.id}
                        className="flex items-center gap-x-4 w-full"
                    >   
                        <div className="flex-1">
                            <MediaItem
                                onClick={() => { } }
                                data={song} 
                                key={song.id}                            
                            />
                        </div>
                        <LikedButton
                            songId={song.id}
                        />
                    </div>
                ))
            }

        </div>
    )
}
