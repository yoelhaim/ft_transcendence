'use client'

import React, { useState } from 'react'
import Game from '@/components/playgame/Game'

export default function WaitPlayers() {

    const [gameStarted, setGameStarted] = useState(true);
    setGameStarted;

    return (
        <div>
            {gameStarted ? <Game avatar='/images/profile.svg' /> : <div className='h-10 w-10 rounded-full bg-white  animate-bounce'></div>}
        </div>
    )
}
