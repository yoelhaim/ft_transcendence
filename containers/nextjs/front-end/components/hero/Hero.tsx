'use client';
import { useState } from 'react';
import HeroActions, { Item } from './Item';

import SendMessage from './Message/SendMessage';

import Image from 'next/image';
import { useSelector } from 'react-redux';
import { redirect, usePathname } from 'next/navigation';
import { AlignRight, Dot } from 'lucide-react';

interface Props {
  avatar: string;
  cover: string;
  userName?: string;
  isOnline: string;
  userId: number;
}

const Hero = ({ avatar, cover, userName, isOnline, userId }: Props) => {
  const [isListVisible, setListVisible] = useState(false);
  const [isMessageVisible, setMessageVisible] = useState(true);
  setMessageVisible;//TODO
  const info = useSelector((state: any) => state.auth);
  const path = usePathname();
  if (userName === info.UserName && path !== '/') redirect('/');

  const toggleList = () => {
    setListVisible(!isListVisible);
  };

  return (
    <>
      {isMessageVisible && <SendMessage />}

      <div
        className={`select-none p-4 h-[358px] flex w-[100%] md:rounded-xl relative bg-cover bg-center`}
        style={{ backgroundImage: `url("${cover}")` }}
      >

        <div className="flex justify-center w-full items-end md:justify-between md:items-start mb-10">
          <div className="w-[160px] h-[150px] relative pointer-events-none">
            {avatar != '' && userName !== info.UserName ? (
              <Image
                src={avatar}
                width={100}
                height={100}
                alt="profile"
                className="w-full h-full rounded-full md:rounded-xl object-cover"
                 blurDataURL='/images/blur.jpg'
              />
            ) : null}
            <div>
              <h3 className="text-2xl p-2">{userName}</h3>
            </div>
            {userName ? (
            <div className="md:hidden flex justify-center items-center rounded  text-xs absolute bottom-2 left-4">
              <span className={`h-5 w-5 ${ isOnline !== 'offline' ? 'bg-[#03C988]' : 'bg-red'} rounded-full`} ></span>
            </div>): null}
          </div>
          {userName ? (
            <div
              className={`hidden md:flex justify-center items-center rounded px-2.5 py-1 ${
                isOnline !== 'offline' ? 'bg-[#03C988]' : 'bg-red'
              } text-white text-xs rounded-sm uppercase `}
            >
             
              <Dot strokeWidth={3} />
              <span className="p-1">{isOnline}</span>
            </div>
          ) : null}
          
        </div>

        {userName ? (
          <div className="px-7 flex md:hidden w-full h-[250px] flex-row-reverse justify-start absolute">
            <div
              className="md:hidden cursor-pointer flex w-[30px] h-[30px] transition-transform duration-300"
              onClick={toggleList}
            >
              <AlignRight className="pointer-events-none"/>
            </div>

            {isListVisible && (
              <div className="top-[5%] relative px-2 bg-[#26274fB8] flex justify-around items-center flex-col rounded-lg transition-opacity duration-300">
                <HeroActions
                  Item={Item}
                  checkedId={userId}
                  className="rounded-xl py-1.5 px-1.5 w-[70px] min-[290px]:w-[150px]"
                />
              </div>
            )}
          </div>
        ) : null}

        <div className="absolute bg-[#26274fB8] bottom-[10px] left-4 right-4 rounded hidden md:flex justify-center">
          {userName ? (
            <div className="flex justify-between items-center w-[100%] max-w-[1000px] p-5">
              <HeroActions Item={Item} checkedId={userId}/>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Hero;
