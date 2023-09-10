import React from 'react'
import Link from 'next/link'
import { Gamepad2 } from 'lucide-react'

export default function PlayGame() {
  return (
    <Link href='/game' className={`flex items-center bg-green-200 px-6 py-4 w-full rounded-lg justify-center cursor-pointer h-[100px]`}>
          <Gamepad2 size={36} />
          <span className='font-semibold text-xl ml-4'>Play Game</span>
    </Link>
  )


  
}
