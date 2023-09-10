'use client'

import React from 'react'
import { useMediaQuery } from '@/hooks/customHooks'

export default function Head() {

  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (

    <div className='w-full bg-dark-200 rounded-tr-md rounded-tl-md py-4 flex justify-between px-16'>
      <div>Players</div>
      <div>Result</div>
      {isDesktop && <div>Date</div>}
    </div>

  )
}
