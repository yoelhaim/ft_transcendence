'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

// import { useDebance } from '@/hooks/customHooks'

import socket from '@/plugins/socket'
import { useSelector } from 'react-redux'


import axios from '@/api/axiosInstances'
import { ToastContainer, toast } from 'react-toastify'

import { FriendInviteToGameToastContainer } from '@/components/toast/CustomToast'

interface Props {
    setOpen: (close: boolean) => void
}

interface ItemProps {
    id: number
    check: number
    avatar: string
    username: string
    setChecked: (id: number) => void
}


function Item({ id, check, avatar, username, setChecked }: ItemProps) {

    return (
        <div className='flex items-center bg-dark-200 p-2 gap-6 rounded-sm'>
            <div>
                <button
                    className='cursor-pointer w-[15px] h-[15px] border-2 border-green-100 rounded-sm grid place-content-center text-lg'
                    onClick={() => setChecked(id)}
                >
                    {check === id && <Check strokeWidth={3} className='translate-x-[3px] translate-y-[-2px]' />}
                </button>
                <input type="radio" id="1" className='hidden' />
            </div>

            <div className='flex items-center gap-6'>
                <Image src={avatar} alt="/" width={50} height={50} className='rounded-md'  blurDataURL='/images/blur.jpg' />
                <span>{username}</span>
            </div>
        </div>
    )

}

export function FriendInviteToGameToast() {


    return (
        <ToastContainer
            containerId={'friend_invite_to_game'}
            position="bottom-right"
            autoClose={2000}
            hideProgressBar={true}
            newestOnTop={true}
            closeOnClick
            draggable
            limit={2}
            rtl={false}
            theme="light"
            enableMultiContainer={false}
        />
    )

}

import React from 'react';


export default function InviteFriend({ setOpen }: Props) {

    const ref = useRef(null)
    const [checked, setChecked] = useState<number>(0)
    const [friends, setFriends] = useState<any[]>([])
    const [search, setSearch] = useState<string>('')
    // const debance = useDebance(search, 300)

    const authUser: number = useSelector((state: any) => state.auth.id)

    const closeDiv = (e: any) => {

        if (e.target === ref.current) {
            setOpen(false)
        }

    }


    const serachforFriend = () => {
    
        axios.get(`/game/friends/${search}`)
            .then(res => {

           
                setFriends(res.data);
            }
            )
            .catch(err => err)

    };


    const invite = () => {

        if (!checked) return;

        const data = {
            checked,
            authUser
        }

        socket.emit('invite', data)

        toast(<FriendInviteToGameToastContainer />)

    }

    const getFriends = () => {

        axios.get('/game/friends')
            .then(res => {
                setFriends(res.data);
            }
            )
            .catch(err =>err)
    }

    useEffect(() => {

        if (search.length === 0) {
            getFriends();
            return;
        }

        serachforFriend();

    }, [search])


    useEffect(() => {

        socket.on('friend_game_timeout', (data: any) => {
            toast.error(`${data.checked} not accept your invite`)
        })

        return () => {
            socket.off('friend_game_timeout')
        }


    }, [])


    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='fixed inset-0 bg-[#26274fB8] z-50 text-white flex justify-center items-center'
                ref={ref}
                onClick={closeDiv}
            >

                <div className='space-y-9 w-[500px] bg-dark p-4 rounded-md'>
                    {/* <span className='text-xs text-red capitalize flex items-center'>
                        <Info size={16} />
                        game friend invite can not be canceled
                    </span> */}
                    <div>
                        <input
                            type="text"
                            className='py-4 px-4 outline-none w-full rounded-md border-2 bg-dark  border-green/[.5] text-white'
                            placeholder='Find Friend ...'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div
                        className='space-y-3 max-h-[300px] overflow-auto scrollbar scrollbar-thumb-dark-200/50 scrollbar-track-dark scrollbar-thumb-rounded-full scrollbar-w-1'
                    >
                        {friends.length ?
                            friends.map((friend) => (
                                <Item key={friend.id} id={friend.id} check={checked} setChecked={setChecked} avatar={friend.avatar} username={friend.UserName} />
                            ))
                            : <div className='text-center text-lg'>No Friends Found</div>}
                    </div>
                    <div className='flex text-lg gap-2'>
                        <button className='bg-red py-4 rounded-sm w-full' onClick={() => { setOpen(false) }}>Close</button>

                        {
                            friends.length ?
                                <button
                                    className='bg-green-100 py-4 rounded-sm w-full active:scale-95 disabled:opacity-50  disabled:pointer-events-none'
                                    onClick={invite}
                                >
                                    Invite
                                </button>
                                : null
                        }

                    </div>
                </div>

            </motion.div>
        </AnimatePresence>
    )
}
