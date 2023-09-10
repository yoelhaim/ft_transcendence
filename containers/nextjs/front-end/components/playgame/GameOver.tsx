'use client'

import { useState, useEffect } from 'react'

import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'

import Card from '../playgame/Card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'


function GameOver({ game }: { game: any }) {

    const { firstPlayerScore, secondPlayerScore, firstPlayerId, secondPlayerId } = game
    const [isWin, setIsWin] = useState<boolean>(false)

    const authUser = useSelector((state: any) => state.auth.id)
    const avatar = useSelector((state: any) => state.auth.avatar)


    useEffect(() => {

        if (firstPlayerScore > secondPlayerScore) {
            if (authUser == firstPlayerId) {
                setIsWin(prev => !prev)
            }
        }
        else {
            if (authUser == secondPlayerId) {
                setIsWin(prev => !prev)
            }
        }

    }, [])

    return (
        <div className='bg-dark z-50 min-h-screen overflow-auto absolute inset-x-0 inset-y-0 flex justify-center items-center'>
            <div className='pyro'>
                <div className='w-full text-center'>
                    <h2
                        className={`uppercase ${ isWin ? 'text-green-100' : 'text-red' }`}
                        style={{ fontSize:  'clamp(1rem, 8vw, 4rem)'}}     
                    >game finished</h2>
                </div>

                <div className='flex flex-col items-center justify-center mt-8'>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1] }}
                    >
                        {
                            isWin ?
                                <h3 className='text-green-100 text-4xl font-bold antialiased mb-5' >YOU WIN +10xp</h3>
                                :
                                <h3 className='text-red text-4xl font-bold antialiased mb-5' >YOU LOSE -10xp</h3>
                        }
                    </motion.div>

                    <motion.div
                        initial={{
                            y: 200,
                            opacity: 0,
                        }}

                        animate={{
                            y: [200, 0],
                            opacity: [0, 1],
                        }}
                    >
                        <Card src={avatar} />
                    </motion.div>

                    <div className='flex mt-4'>
                        <Link
                            href='/'
                            className='flex justify-center items-center gap-2 text-white  uppercase rounded-md px-4 py-2'
                        >
                            <ArrowLeft />
                            Go to home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameOver;
