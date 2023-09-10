'use client'


import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation';
import socket from '@/plugins/socket'
import { useSelector } from 'react-redux';


// import 

import axios from '@/api/axiosInstances'
import FullGame from './FullGame';


interface LoadCardProps {
    setCancel: (param: boolean) => void;
    setStartGame: (param: boolean) => void;
    setSecondPlayer: (param: string) => void;
    setTheme: (param: string) => void;
}

export function LoadCard({ setCancel, setStartGame, setSecondPlayer, setTheme }: LoadCardProps) {


    const authUserId = useSelector((state: any) => state.auth.id);

    const [src, setSrc] = useState<string>('/images/random/1.jpg')
    const ref = useRef(null);

    const images: string[] = [
        '/images/random/1.jpg',
        '/images/random/2.jpg',
        '/images/random/3.jpg',
        '/images/random/4.jpg',
        '/images/random/5.jpg',
        '/images/random/6.jpg',
        '/images/random/7.jpg',
        '/images/random/8.jpg',
        '/images/random/9.jpg',
        '/images/random/10.jpg',
        '/images/random/11.jpg',
        '/images/random/12.jpg',
        '/images/random/13.jpg',
        '/images/random/14.jpg',
        // '/images/random/15.jpg',
    ]

    let index: number = 1;

    useEffect(() => {

        if (!authUserId) return;
        const node: any = ref.current;
        if (!node) return;

        let inetr = setInterval(() => {
            setSrc(images[index++]);
            if (index === images.length) index = 0;
        }
        , 200)

        socket.emit('waiting_for_match', { authUserId: authUserId });

        socket.on('match_found', (room, players, themes) => {

            localStorage.setItem('room', room);
            
           

            let secondPlayer = players.first === authUserId ? players.second : players.first;
            setSecondPlayer(secondPlayer);

            if (players.first == authUserId) {
                
                setTheme(themes.firstUserTheme.image);
            }
            else {
                
                setTheme(themes.secondUserTheme.image);
            }

            axios.get(`/game/user/${secondPlayer}`)
                .then((res) => {
                    clearInterval(inetr);
                    setSrc(res.data.avatar);
                    setCancel(false);
                    setStartGame(true);
                })
                .catch(err => { err; })
        })

        return () => {
            clearInterval(inetr);
            socket.off('match_found');
        }

    }, [authUserId])

    return (
        <div>
            <div
                className='h-[200px] w-[200px] rounded-lg overflow-hidden'
            >
                <Image ref={ref} src={src} width={300} height={400} alt="#" className='w-full h-full object-cover'  blurDataURL='/images/blur.jpg'/>
            </div>
        </div>
    )
}


export default function Matchmaking() {

    const [Cancel, setCancel] = useState<boolean>(true);
    const [startGame, setStartGame] = useState<boolean>(false);
    const [theme, setTheme] = useState<string>('/textures/ice2.jpg');
    const authUserId = useSelector((state: any) => state.auth.id);
    

    
    const [secondPlayer, setSecondPlayer] = useState<string>('');

    const { push } = useRouter();

    const cancelMatch =  () => {

        if (!authUserId) return;



        socket.emit('cancel_match', {authUserId});
    }

    useEffect(() => {

        
        if (!authUserId) return;

        socket.emit("joinGlobalGame", authUserId);
        socket.on('match_cancelled', () => {
            push('/')
        })

        return () => {
            socket.off('match_canceled');
        }

    }, [authUserId])

    useEffect(() => {

        return () => {
            if (Cancel && !startGame) cancelMatch();
        }

    }, [])

    return (

        <>
            {
                !startGame ?
                    <div
                        className='h-screen w-screen bg-dark text-[#F4F4F4] flex justify-around items-center'
                    >
                        <div className='flex flex-col gap-2 text-center'>
                            <LoadCard setCancel={setCancel} setStartGame={setStartGame} setSecondPlayer={setSecondPlayer} setTheme={setTheme}/>
                            {Cancel && <button className='bg-red w-full rounded-lg py-2' onClick={cancelMatch}>Cancel</button>}
                        </div>
                    </div>
                    :
                    <FullGame secondPlayer={secondPlayer} theme={theme}/>
            }
        </>
    )
}
