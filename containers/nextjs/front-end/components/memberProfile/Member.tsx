'use client';

import React, { useEffect, useState } from 'react';

import TableCompletedGames from '@/components/chatBox/TableCompletedGames';
import Hero from '@/components/hero/Hero';
import PlayGame from '@/components/playgame/PlayGame';
import axios from '@/api/axiosInstances';
import { useDispatch, useSelector } from 'react-redux';
import { setNameSender } from '@/redux_toolkit/auth';
import { PendingUserProfile } from './pending';
import { NotFoundUserProfile } from './notFound';
import PlayFriend from '../playgame/PlayFriend';
import Archivment from '../archivment/Archivment';

interface Props {
  userLogin?: string | null;
}

export default function Member({ userLogin }: Props) {
  const [avatar, setAvatar] = useState<string>('');
  const [cover, setCover] = useState<string>('');
  const [online, setOnline] = useState<string>('');
  const [exits, setExits] = useState<string>('pending');
  const [score , setScore]= useState<number>(0);
  const [userId , setUserId]= useState<number>(0);
  const distpatch = useDispatch();
  const info = useSelector((state: any) => state.auth);

  useEffect(() => {
    distpatch(setNameSender(userLogin!));
    const user = userLogin ? userLogin : '';
    axios
      .get(`/profile/${user}`)
      .then((res) => {
        setAvatar(res.data.avatar);
        setCover(res.data.cover);
        setOnline(res.data.isOnline);
        setScore(res.data.score);
        setUserId(res.data.id);
        setExits('exits');
      })
      .catch(({ response }) => {
        response;
        // toast.warn(`${response?.data?.message}`);
        setExits('notfound');
      });
  }, []);

  return (
    <>
      {exits === 'pending' ? (
        <PendingUserProfile />
      ) : exits === 'notfound' ? (
        <NotFoundUserProfile />
      ) : (
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-5">
            <Hero
              avatar={avatar}
              cover={cover}
              userName={userLogin!}
              isOnline={online}
              userId={userId}
            />
          </div>
          <div className="col-span-5 min-[1200px]:col-span-3">
            <TableCompletedGames userName={userLogin ? userLogin: info.UserName } />
          </div>

          <div className="col-span-5 min-[1200px]:col-span-2 ">
            <div className="flex flex-col sm:flex-row gap-4">
              {!userLogin ? (
                <>
                  <PlayFriend />
                  <PlayGame />
                </>
              ) : null}
            </div>
            <Archivment score={score} />
          </div>
        </div>
      )}
    </>
  );
}
