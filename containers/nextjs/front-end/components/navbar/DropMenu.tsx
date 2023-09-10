'use client';

import React from 'react'

import Logout from './Logout';
import NotificationList from './NotificationList';

export default function DropMenu({isMessage}: {isMessage: boolean}) {
  return (
    <div className='absolute w-96 bg-dark shadow-md shadow-[#151634] break-words right-0 py-4 rounded-lg z-50'>
        {
            isMessage ? <Logout/> : <NotificationList />
        }
    </div>
  )
}
