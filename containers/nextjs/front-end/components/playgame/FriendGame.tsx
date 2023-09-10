'use client'

import { useSelector } from 'react-redux'
import FullGame from './FullGame'
import { useEffect, useState } from 'react'

import socket from '@/plugins/socket'
import { useRouter } from 'next/navigation';


function WaitingForSecondPlayer() {

  const authUser = useSelector((state: any) => state.auth.id)
  const {push} = useRouter();

  useEffect(() => {
    if (!authUser) return;

    socket.emit('redy_for_friend_game', {
      authUser
    })

    socket.on('friend_not_invited', () => {
        push('/')
    })

  }, [authUser])

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-dark-100 text-white">
      <div className="text-4xl font-bold text-gray-700">Waiting For Second Player</div>
      <div className="mt-4 text-2xl font-bold text-gray-700">Please Wait</div>
      <div className="w-[20px] h-[20px] bg-white animate-bounce rounded-full"></div>
    </div>
  )
}

export default function FriendGame() {


  const authUser = useSelector((state: any) => state.auth.id)
  const [secondPlayer, setSecondPlayer] = useState<string>('')

  const [startGame, setStartGame] = useState<boolean>(false)
  const [theme, setTheme] = useState<string>('/textures/ice2.jpg');

  useEffect(() => {

    if (!authUser) return;

    // const data = { authUser }
    // socket.emit('friend_game_players', data)

    socket.on('froent_friend_game_players', (data: any, theme: any) => {

      data[0] === authUser ? setSecondPlayer(data[1]) : setSecondPlayer(data[0])

     
      setStartGame(true)

        if (theme.firstUserTheme.id === authUser)
            setTheme(theme.firstUserTheme.image)
        else
            setTheme(theme.secondUserTheme.image)

    })

  }, [authUser])

  return (
    startGame ?
      <FullGame secondPlayer={secondPlayer} theme={theme} />
      :
      <WaitingForSecondPlayer />
  )

}