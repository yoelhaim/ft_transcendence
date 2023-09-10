'use client'

import { useEffect } from 'react'

import instance from '@/api/axiosInstances'
import socket from '@/plugins/socket'
import { useSelector } from 'react-redux';


export default function RoomNotifications(
    { obj }: { obj: any }
) {
    const authUserId = useSelector((state: any) => state.auth.id);

    const { id, read, roomRotification: [
        {
            message,
        }
    ] } = obj

    useEffect(() => {

        if (read == true) return;
    
        instance.patch(`/notifications`, {
            id
        })
            .then(
                () => {
                  
                    socket.emit('message-notification', authUserId)
                }
            )
            .catch(
                (err: any) => {
                    err;
                }
            )
        
    }, [])


    return (
        <li className={`${read == false ? 'bg-green/[.2]' : ''} hover:bg-dark-200 px-4 py-2 mt-[1px]`}>
            <span className='text-sm text-green/[.5] block'>Today</span>
            {message}
        </li>
    )
}
