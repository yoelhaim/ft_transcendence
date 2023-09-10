'use client';

import React from 'react';

import Image from 'next/image';
import { Check, X } from 'lucide-react';

import { useEffect } from 'react';

import instance from '@/api/axiosInstances';
import socket from '@/plugins/socket';
import axios from '@/api/axiosInstances';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

export default function FriendRequest({ obj }: { obj: any }) {
    const authUserId = useSelector((state: any) => state.auth.id);
  const {
    id,
    read,

    sender: { UserName, avatar },
  } = obj;

  const accept = () => {
    axios.post('/profile/accept/'+ UserName).then(() => {
        toast.success('Accept friend request success');
    });
  };

  const reject = () => {
    axios.post('/profile/reject/'+ UserName).then((res) => {
        toast.success(res.data  +" "+ UserName );
    });
  };

  useEffect(() => {
    if (read == true) return;

    instance
      .patch(`/notifications`, {
        id,
      })
      .then(() => {
        socket.emit('message-notification', authUserId);
      })
      .catch((err: any) => {
        err;
        
      });
  }, []);

  return (
    <li
      className={`${
        read == false ? 'bg-green/[.2]' : ''
      } hover:bg-dark-200 px-4 py-2 mt-[1px]`}
    >
      <span className="text-sm text-green/[.5] block">
        Today: Friend Request
      </span>
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Image
            src={avatar}
            width={40}
            height={40}
            alt="avatar"
            className="rounded-full"
             blurDataURL='/images/blur.jpg'
          />
          <span>{UserName}</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={accept}>
            <Check strokeWidth={2.5} />
          </button>
          <button onClick={reject}>
            <X strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </li>
  );
}
