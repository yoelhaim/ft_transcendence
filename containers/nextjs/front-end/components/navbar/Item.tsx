'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useDispatch } from 'react-redux'

import { closeSearch } from '@/redux_toolkit/search/searchSlice'

interface Props {
  login: string
  avatar_url: string
}

export default function Item({ login, avatar_url }: Props) {
  

  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(closeSearch())
  }

  return (
    <li onClick={handleClick}>
      <Link
        href={`/member/${login}`}
        className='flex items-center px-2 py-1 cursor-pointer hover:bg-dark-200'
      >
        <Image src={avatar_url} width={30} height={30} alt='avatar' className='rounded-full'  blurDataURL='/images/blur.jpg' />
        <span className='ml-2'>{login}</span>
      </Link>
    </li>
  )
}
