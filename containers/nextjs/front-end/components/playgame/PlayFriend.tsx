'use client'

import { Users2 } from 'lucide-react'
import { useState } from 'react'


import InviteFriend from './InviteFriend'



export default function PlayFriend() {

    const [open , setOpen] = useState(false)

    return (
        <>
            {open && <InviteFriend setOpen={setOpen}/>}
            <button
                className={`flex items-center bg-green-200 px-6 py-4 w-full rounded-lg justify-center cursor-pointer h-[100px]`}
                onClick={() => setOpen(!open)}
            >
               
                <Users2 size={36} />
                <span className='font-semibold text-xl ml-4'>Play a friend</span>
            </button>
        </>
    )
}
