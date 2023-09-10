'use client';

import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react';


import { useMediaQuery } from '@/hooks/customHooks'
import { Game } from '@/types/Game'

import instance from '@/api/axiosInstances';


export default function Body({username}: {username: string}) {

    const [numbers, setNumbers] = useState<number[]>([]);
    const [matchHistory, setMatchHistory] = useState([]);
    const [pages, setPages] = useState<number>(0);
    const [active, setActive] = useState<number>(0);



    const isDesktop = useMediaQuery('(min-width: 768px)');


    const navigate = (index: number) => {

        if (index == -1 && active == 0) {
            return;
        }

        if (index == 1 && active == pages - 1) {
            return;
        }

        if (active == numbers.length - 1 && index == 1) {
        
            setNumbers([...numbers, numbers[numbers.length - 1] + 1]);
        
        }

        setActive(active + index);
    }


    useEffect(() => {

        instance.get(`/game/history/${username}/${active}`)
            .then((res) => {

                const { games, numberOfpages } = res.data;

                setMatchHistory(games);
                setPages(numberOfpages);

                if (numbers.length == 0) {
                
                    if (pages > 5) {
                        setNumbers([...Array(5 + 1).keys()].slice(1));
                        return ;
                    }
                    setNumbers([...Array(pages + 1).keys()].slice(1));
                }
            }
            )
            .catch((err) => {err
            })
    }, [active]);

    return (


        <div>
            <div>
                {
                    matchHistory.map(({ firstPlayer, secondPlayer, firstPlayerScore, secondPlayerScore, createdAt, id }: Game) => {
                        return (
                            <div key={id} className='flex justify-between items-center bg-dark-200/[.6] px-16 py-4 border-b-2 border-green-300'>
                                <div className='flex flex-col'>
                                    <span>{firstPlayer.UserName}</span>
                                    <span>{secondPlayer.UserName}</span>
                                </div>
                                <div className='flex flex-col w-[70px] text-right'>
                                    <span>{firstPlayerScore}</span>
                                    <span>{secondPlayerScore}</span>
                                </div>
                                {isDesktop && <div>{createdAt.split('T')[0]}</div>}
                            </div>
                        )
                    })
                }
            </div>


{
                pages > 1 &&
                    <div className='select-none w-full bg-dark-200 rounded-br-md rounded-bl-md py-4 flex justify-end px-8 items-center'>
                        <span
                            className={`mx-1 w-[30px] h-[30px] grid place-content-center rounded-lg hover:bg-dark/[.5] ${ active == 0 ? 'cursor-not-allowed' :  'cursor-pointer'}`}
                            onClick={() => { navigate(-1) }}
                        >
                            <ChevronLeft />
                        </span>
                        <ul className='flex'>

                        {numbers.slice(Math.max(0, active - 1), Math.min(numbers.length, active + 2)).map((item, index) => {
                            return (
                                <li
                                    key={index}
                                    onClick={() => { setActive(item - 1) }} // Subtract 1 to convert 1-based index to 0-based index
                                    className={`bg-dark mx-1 border-[2px] border-dark-green w-[30px] h-[30px] grid place-content-center rounded-lg hover:bg-dark-green ${active == item - 1 ? 'bg-dark-green' : ''} cursor-pointer`}
                                >
                                    {item}
                                </li>
                            );
                        })}

                        </ul>
                        <span
                            className={`mx-1 w-[30px] h-[30px] grid place-content-center rounded-lg hover:bg-dark/[.5] ${ active == numbers.length - 1 ? 'cursor-not-allowed' :  'cursor-pointer'}`}
                            onClick={() => { navigate(1) }}
                        >
                            <ChevronRight />
                        </span>
                    </div>
            }
        </div>
    )
}
