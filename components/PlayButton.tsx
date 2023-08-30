import React from 'react'
import { FaPlay } from 'react-icons/fa'

export default function PlayButton() {
  return (
    <button
        className='text-black transition opacity-0 flex items-center rounded-full bg-green-500
                    p-4 drop-shadow-md translate translate-y-1/4 group-hover:opacity-100
                    group-hover:translate-y-0 hover:scale-110'   
    >
        <FaPlay/>
    </button>
  )
}
