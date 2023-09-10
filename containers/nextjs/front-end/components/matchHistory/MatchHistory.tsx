import React from 'react'

import Head from './Head'
import Body from './Body'



export default function MatchHistory({username}: {username: string}) {
  return (
    <div className=' w-full font-semibold'>
        <Head />
        <Body username={username}/>
    </div>
  )
}
