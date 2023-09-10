'use client';

import React, { ReactNode, useEffect, useState } from 'react';

import { open } from '@/redux_toolkit/sendMessage/sendMessageSlice';

import { useDispatch, useSelector } from 'react-redux';

import { twMerge } from 'tailwind-merge';
import axios from '@/api/axiosInstances';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  Ban,
  Gamepad2,
  MessageCircle,
  User2,
  UserCheck2,
  UserPlus2,
} from 'lucide-react';
import { UserMinus2 } from 'lucide-react';
import socket from '@/plugins/socket';

interface Props {
  name: ReactNode;
  label: string;
  className?: string;
  handleClick: () => void;
}

export function Item({ name, label, className, handleClick }: Props) {
  return (
    <button
      className={twMerge(
        'flex justify-center items-center rounded bg-[#393A6C] hover:bg-[#44467d] text-[#ADF0D1] py-2.5 px-6 text-xs h-[50px]',
        className,
      )}
      onClick={handleClick}
    >
      {name}
      <span className="ml-1.5 text-xs md:hidden min-[950px]:block">
        {label}
      </span>
    </button>
  );
}

export default function HeroActions({
  Item,
  className,
  checkedId,
}: {
  Item: React.FC<Props>;
  className?: string;
  checkedId?: number;
}) {
  const { login } = useParams();
  const { push } = useRouter();

  const dispatch = useDispatch();

  const [friendStatus, setFriendStatus] = useState<string>('');

  const [blockStatus, setBlockStatus] = useState<string>('');

  const userId = useSelector((state: any) => state.auth.id);

  const [icon, setIcon] = useState<ReactNode>(<UserPlus2 />);

  const authUser: number = useSelector((state: any) => state.auth.id);


  useEffect(() => {
    if (!userId || !login) return;
    // Fetch friend status when component mounts (use your senderId and receiverId here)
    fetchBlockStatus(login);
    fetchFriendStatus(userId, login);
  }, [userId]);

  const fetchFriendStatus = (senderId: number, receiverId: string) => {
    // Make an API call to fetch the friend status from the backend
    axios
      .get(`/profile/${senderId}/${receiverId}`)
      .then((res) => {
        if (res.data === 'accepted') {
          setFriendStatus('FRIENDS');
          setIcon(<User2 />);
        } else if (res.data === 'pendingacc') {
          setFriendStatus('PENDING REQUEST');
          setIcon(<UserMinus2 />);
        } else if (res.data === 'pending') {
          setFriendStatus('ACCEPT REQUEST');
          setIcon(<UserCheck2 />);
        } else setFriendStatus('ADD FRIEND');
      })
      .catch(({ response }) => {
        response;
      });
  };
  const fetchBlockStatus = (receiverId: string) => {
    // Make an API call to fetch the friend status from the backend
    axios
      .get(`/block/${receiverId}`)
      .then((res) => {
        res;
        // push('/');
      })
      .catch(() => {
        toast.warn('account  doasn`t found ');
      });
  };

  const friend = () => {
    axios
      .put(`/profile/${login}`)
      .then((res) => {
        if (
          res.data === 'FREIND REQUEST DELETED' ||
          res.data === 'Friend request not added.'
        ) {
          setFriendStatus('ADD FRIEND');
        } else if (res.data === 'FREIND REQUEST ACCEPTED') {
          setFriendStatus('FRIENDS');
          setIcon(<User2 />);
        } else if (res.data != 'not friends' && res.data != 'User not found.') {
          setFriendStatus('PENDING REQUEST');
          setIcon(<UserMinus2 />);
        } else {
          setFriendStatus('');
        }
        // The 'PENDING REQUEST' label should not be set here, as it's handled by fetchFriendStatus
      })
      .catch((response) => {
        toast.error(response?.data?.message);
      });
  };

  const challenge = () => {
    if (checkedId == undefined) return;

    const data = {
      authUser: authUser,
      checked: checkedId,
    };


    socket.emit('invite', data);
  };

  const message = () => {
    dispatch(open());
  };

  const block = () => {
    if (blockStatus === 'UNBLOCK') return;
    axios
      .put(`/block/${login}`)
      .then((res) => {
        if (res.data === 'blocked') setBlockStatus('UNBLOCK');
        else setBlockStatus('BLOCK');
        fetchFriendStatus(userId, login);
        toast.info(`${login} blocked`);
        push('/');
      })
      .catch(({ response }) => {
        toast.warn(response?.data?.message);
      });
  };

  const friendLabel = friendStatus === '' ? 'ADD FRIEND' : friendStatus;
  const blockLabel = blockStatus === '' ? 'BLOCK' : blockStatus;
  const items = [
    { name: icon, label: friendLabel, handleClick: friend },
    { name: <Gamepad2 />, label: 'Challenge', handleClick: challenge },
    { name: <MessageCircle />, label: 'Message', handleClick: message },
    { name: <Ban />, label: blockLabel, handleClick: block },
  ];

  return (
    <>
      {items.map((item, index) => (
        <Item
          key={index}
          name={item.name}
          label={item.label}
          className={className}
          handleClick={item.handleClick}
        />
      ))}
    </>
  );
}
