'use client'

import { Check, X } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect } from 'react'

import socket from '@/plugins/socket';
import { useSelector } from 'react-redux';

import axios from '@/api/axiosInstances';
// import { toast } from 'react-toastify';

interface Props {
    friend: number
}

export default function CustomToast({friend} : Props) {

    const authUser = useSelector((state: any) => state.auth.id)

    const [userName, setUserName] = React.useState<string>('')
    const [userAvatar, setUserAvatar] = React.useState<string>('/images/profile.svg')

    // const { push } = useRouter();
    const accept = () => {

        const data = {
            authUser,
            friend
        }

        socket.emit('acceptInvite', data)
       
    }

    const decline = () => {
        // toast.dismiss();
    }


    useEffect(() => {

       
        
        axios.get(`/profile/id/${friend}`)
            .then(res => {
                setUserName(res.data.UserName)
                setUserAvatar(res.data.avatar)
            })
            .catch(err => err)
            
    }, [])


    return (
        <div className="flex items-center justify-between h-full w-full text-white">
            <div className="flex items-center gap-2">
                <div>
                    <Image
                        src={userAvatar}
                        alt="/"
                        width={50}
                        height={50}
                        className='rounded-md'
                    />
                </div>
                <span className='text-lg tracking-wider antialiased'>{userName}</span>
            </div>
            <div className='flex gap-2'>
                <button onClick={decline}><X className='hover:bg-red text-white' /></button>
                <button onClick={accept}><Check className='hover:bg-green-100 text-white' /></button>
            </div>
        </div>
    );
}



export function FriendInviteToGameToastContainer() {

    return (
        <div className='relative z-30 text-[#F4F4F4]'>
            inivite to game sended
        </div>
    )

}
