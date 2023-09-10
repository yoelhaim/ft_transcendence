'use client';



import React, { useState, useEffect } from 'react'
import Card from '@/components/playgame/Card'
import GameOver from './GameOver';

import { useMediaQuery } from '@/hooks/customHooks';

import { useSelector } from 'react-redux';
import Game from './Game';
import axios from '@/api/axiosInstances';
import socket from '@/plugins/socket';

interface FullGameProps {
  secondPlayer: string;
  theme?: string;
}

export default function FullGame({ secondPlayer, theme}: FullGameProps) {

  const  [isGameFinshed, setIsGameFinshed]  = useState(false)
  const [game, setGame] = useState<any>(null)

  const avatar = useSelector((state: any) => state.auth.avatar);
  const isDesktop = useMediaQuery('(min-width: 1600px)')

  const [secondPlayerAvatar, setSecondPlayerAvatar] = useState<string>('/images/profile.svg')

 

  useEffect(() => {

    if (!avatar.length) return;

    axios.get(`/game/user/${secondPlayer}`)
      .then(res => {
        
        setSecondPlayerAvatar(res.data.avatar)
      })
      .catch(err =>err)


      socket.on('game_finshed', (data: any) => {

       
        setGame(data)
        setIsGameFinshed(true)

      })

      return () => {
        socket.off('game_finshed')
      }



  }, [avatar])

  return (
    <div className='h-screen w-screen bg-black flex justify-around items-center'
      style={{ background: `url(/images/bg2.svg)` }}
    >
      {
        !isGameFinshed ?
          <>
            {isDesktop && <Card src={avatar} />}
            <Game avatar={secondPlayerAvatar} theme={theme}/>
            {isDesktop && <Card src={secondPlayerAvatar} />}
          </>
          :
          <GameOver game={game} />
      }
    </div>
  )
}