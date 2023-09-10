'use client';

import { useEffect, useState, useRef } from 'react';

import FriendRequest from './notificationItems/FriendRequest';
import RoomNotifications from './notificationItems/RoomNotifications';
import instance from '@/api/axiosInstances';

interface Props {
  setIsOpen?: (param: boolean) => void;
}

export default function NotificationList({ setIsOpen }: Props) {
  const [notifications, setNotifications] = useState<any[]>([]);

  const getComponent = (obj: any) => {
    let id = obj.id;

    switch (obj.type) {
      case 'friendRequestNotification':
        return <FriendRequest key={id} obj={obj} />;

      case 'roomNotification':
        return <RoomNotifications key={id} obj={obj} />;

      default:
        return null;
    }
  };

  const notificationRef = useRef<HTMLDivElement>(null);

  const closeList = (e: any) => {
    if (!notificationRef.current?.contains(e.target)) {
      
      setIsOpen!(false);
      return;
    }
  };

  useEffect(() => {
    document.addEventListener('click', closeList);

    instance
      .get('/notifications')
      .then((res: any) => {
        setNotifications(res.data);
      })
      .catch((err: any) => {
        err;
      
      });

    return () => {
      document.removeEventListener('click', closeList);
    };
  }, []);

  return (
    <div
      ref={notificationRef}
      className="absolute w-11/12 sm:w-96 bg-dark shadow-md shadow-[#151634] break-words right-0 py-4 rounded-lg z-50 translate-y-2 left-[50%]  sm:left-auto -translate-x-[50%] sm:translate-x-0"
    >
      <div className="flex justify-between uppercase text-sm px-4">
        <span>notifications</span>
      </div>
      <ul className="list-none m-0 mt-3 text-sm max-h-80 overflow-auto scrollbar scrollbar-thumb-dark-200/50 scrollbar-track-dark scrollbar-thumb-rounded-full scrollbar-w-1">
        {notifications.map((notification: any) => {
          return getComponent(notification);
        })}
      </ul>
    </div>
  );
}
