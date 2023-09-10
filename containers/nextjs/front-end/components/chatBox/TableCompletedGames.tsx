'use client'

import Link from 'next/link';
import Tr from './Tr'

import axios from '@/api/axiosInstances';
import { useEffect, useState } from 'react';


import { Game } from '@/types/Game'

interface Props {
    userName: string
}

export default function TableCompletedGames({userName}: Props) {

    const [data, setData] = useState<any>([])

    useEffect(() => {



        axios.get(`/game/${userName}`)
            .then(res => {
                setData(res.data)
            })
            .catch(err => {
                err;
            })

    }, [])

    return (
        <div className="bg-dark-200 rounded-2xl ">
            <div className='h-15 p-5 '>
                Completed Games
            </div>
            <table className="bg-[#26274F] w-full text-center">
                <thead>
                    <tr className='h-12'>
                        <th className='text-left pl-4 sm:pl-14 w-fit'>
                            Players
                        </th>
                        <th>
                            Result
                        </th>
                        <th>
                            Date
                        </th>

                    </tr>
                </thead>
                <tbody>
                    {
                        data.map(({ firstPlayer, secondPlayer, firstPlayerScore, secondPlayerScore, createdAt, id }: Game, index: number) => {
                            return (
                                <Tr
                                    key={id}
                                    firstPlayer={firstPlayer.UserName}
                                    secondPlayer={secondPlayer.UserName}
                                    secondPlayerScore={secondPlayerScore}
                                    firstPlayerScore={firstPlayerScore}
                                    index={index}
                                    date={createdAt.split('T')[0]}
                                />
                            )
                        })
                    }

                </tbody>
            </table>
            
            <div className="text-center text-sm h-12 py-3  cursor-pointer">
                <Link href={`/history/${userName}`}>
                    See all
                </Link>
            </div>
        </div>
    );
}