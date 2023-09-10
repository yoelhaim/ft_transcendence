'use client'

import React, { useEffect, useState } from 'react'

import socket from '@/plugins/socket'

import { useSelector } from 'react-redux'

export default function Result() {

  const [blueResult, setBlueResult] = useState(0);
  const [redResult, setRedResult] = useState(0);

  const authuser = useSelector((state: any) => state.auth)

  useEffect(() => {
  
    socket.on('result', (data: any) => {

      if (data.firstPlayerId == authuser.id) {
        setBlueResult(data.firstPlayerScore);
        setRedResult(data.secondPlayerScore);
      }
      else {
        setBlueResult(data.secondPlayerScore);
        setRedResult(data.firstPlayerScore);
      }
    })

    return () => {
      socket.off('result')
    }
  }, [])

  return (
    <div className='flex justify-between items-center border border-[#F2C94C]
          w-[265px] h-[90px] max-w-[300px] m-auto p-2 rounded-lg mt-8 text-[#F4F4F4]'>
        <div className='bg-[#EA906C] h-full w-[73px] rounded-lg text-7xl grid place-content-center'>
            <span>{redResult}</span>
        </div>
        <span className='text-[#F2C94C] text-2xl'>vs</span>
        <div className='bg-[#3B559F] h-full w-[73px] rounded-lg text-7xl grid place-content-center'>
            <span>{blueResult}</span>
        </div>
    </div>
  )
}