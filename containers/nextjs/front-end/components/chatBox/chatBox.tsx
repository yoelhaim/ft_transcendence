'use client';

import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import axios from '@/api/axiosInstances';

import { ChatBoxs, SearchBar, UserBlock } from './UserFriend';
import { setListFriend } from '@/redux_toolkit/conversation/conversationSlice';
import moment from 'moment';
import { ArrowLeftIcon } from 'lucide-react';

import { setShowHide } from '@/redux_toolkit/navbar/navbarSlice';

export default function ChatBox() {


  const [startConv, setStartConv] = useState<boolean>(false);


  const dispatch = useDispatch();

  const users = useSelector((state: any) => state.conversation.listFreind);
  const id = useSelector((state: any) => state.auth.id);
  const { fullName, avatar } = useSelector((state: any) => state.conversation);
  const { showHide } = useSelector((state: any) => state.navbar);

    const [friends, setFriends] = useState<any[]>([])

    const [search, setSearch] = useState<string>('')

const setFriendsList = (friends: any[], search: string) => {


    setSearch(search)
    setFriends(friends)
}

  const arrowRef = useRef<HTMLButtonElement>(null);
  const handleClickOnDiv = (e: any) => {
    if (arrowRef.current?.contains(e.target)) {
      setStartConv(false);
      return;
    }
    dispatch(setShowHide());
  };
  useEffect(() => {
    if (!id) return;
    axios
      .get('/list/friends/' + id)
      .then((res) => {
        dispatch(setListFriend(res.data));
      })
      .catch((err) => {err;});
  }, [id, showHide, startConv]);

  return (
    <div>

      <div
        className={`fixed right-7 shodow shadow-sm shadow-black/50 max-sm:right-0 bg-[#393A6C] w-[350px] max-sm:h-full max-sm:w-full flex justify-between flex-col  ${
          showHide ? '-bottom-[30rem] max-sm:-bottom-[100%]' : 'bottom-0'
        }`}
      >
        <div
          className="h-10 w-full bg-[#153E90] flex justify-between items-center p-2  text-semibold cursor-pointer"
          onClick={handleClickOnDiv}
        >
          <div className="w-full">
            {startConv ? (
              <div className="flex">
                <button ref={arrowRef}>
                  <ArrowLeftIcon />
                </button>
                <div className="flex items-center gap-2 w-full">
                  <Image
                    className="rounded-full h-8 w-8"
                    src={avatar}
                    height={30}
                    width={30}
                    alt="/"
                     blurDataURL='/images/blur.jpg'
                  />
                  <span className="w-full">{`${fullName}`}</span>
                </div>
              </div>
            ) : (
              'Chat'
            )}{' '}
          </div>
        </div>
        <div className="h-[30rem] px-2 max-sm:h-full  overflow-y-auto scrollbar scrollbar-w-2 scrollbar-thumb-[#393A6C] scrollbar-track-[#393A6C]">
          {startConv ? (
            <ChatBoxs />
          ) : (
            <>
              <SearchBar setFriendsList={setFriendsList}/>


              {
              
              search.length === 0 ? 
              users.map((user: any, index: number) => (
                <UserBlock
                  key={index}
                  channelId={user.data.id}
                  name={user.data.firstName + ' ' + user.data.lastName}
                  image={user.data.avatar}
                  status={user.data.isOnline == 'offline' ? false : true}
                  bio={user.message?.message}
                  show={startConv}
                  lastLogin={
                    user.data.isOnline === 'offline'
                      ? moment(user.data.updatedAt).fromNow()
                      : user.data.isOnline
                  }
                  changestate={setStartConv}
                />
              ))
              :
              friends.map((user: any, index: number) => (
                <UserBlock
                  key={index}
                  channelId={user.id}
                  name={user.firstName + ' ' + user.lastName}
                  image={user.avatar}
                  status={user.isOnline == 'offline' ? false : true}
                  bio={user.message?.message}
                  show={startConv}
                  lastLogin={
                    user.isOnline === 'offline'
                      ? moment(user.updatedAt).fromNow()
                      : user.isOnline
                  }
                  changestate={setStartConv}
                />
              ))
              }
            </>
          )}
        </div>
      </div>
    </div>
  );
}
