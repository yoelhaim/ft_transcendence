'use client';

import { useState } from 'react';

import NotificationCounter from './NotificationCounter';
import NotificationList from './NotificationList';
import { Bell, MessageCircle } from 'lucide-react';

import { setShowHide } from '@/redux_toolkit/navbar/navbarSlice';
import { useDispatch } from 'react-redux';

interface Props {
  name: string;
  className?: string;
}

export function OpenChat() {
  const dispatch = useDispatch();

  return (
    <div className="relative block sm:hidden">
      <div
        className={`grid place-content-center bg-dark border-2 border-green/[.5] rounded-[10px] h-[41px] w-[41px] relative cursor-pointer select-none`}
        onClick={() => dispatch(setShowHide())}
      >
        <MessageCircle />
      </div>
    </div>
  );
}

export default function Notification({ name, className }: Props) {
    name;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="sm:relative" >
      <div
        onClick={toggle}
        className={`grid place-content-center bg-dark border-2 border-green/[.5] rounded-[10px] h-[41px] w-[41px] relative cursor-pointer select-none ${className}`}
      >
        <Bell size={20} />
        <NotificationCounter />
      </div>

      {isOpen && <NotificationList setIsOpen={setIsOpen}/>}
    </div>
  );
}
