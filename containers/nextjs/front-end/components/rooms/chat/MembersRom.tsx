'use client';
import UserChat from '@/components/chat/UserChat';
import { entrypointUserRoom } from '@/data/entrypoint';
import fetchGetData, { postData } from '@/data/fetchData';

import { motion } from 'framer-motion';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  MoveLeft,
  Ban,
  ShieldCheck,
  UserX2,
  VolumeX,
  User2,
  User,
} from 'lucide-react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  addNewBloxkedUser,
  fetchUserRoom,
} from '@/redux_toolkit/rooms/roomsRedux';
import socket from '@/plugins/socket';

interface Props {
  setShowMembers: (param: boolean) => void;
  data: any;
}

function ApplyActionOnMember({ setShowMembers, data }: Props) {
  const id = useSelector((state: any) => state.auth.id);
  const dispatch = useDispatch();
  const [admin, setAdmin] = useState<boolean>(data[3]);
  const [showMute, setMute] = useState<boolean>(false);
  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const mute = [
    { name: 'none', value: 0 },
    { name: '1 minit', value: 1 },
    { name: '1 hour', value: 10 },
    { name: '8 hour', value: 80 },
    { name: '1 day', value: 10 },
  ];

  const actionUser = async (type: string, value?: number) => {
    postData('/join/block', {
      userId: data[1],
      adminId: id,
      roomId: data[0],
      type: type,
      timer: !value ? 0 : value,
    })
      .then((res: any) => {
        toast.success(
          type === 'block'
            ? 'user is blocked now'
            : type === 'mute'
            ? !value ? "user unmeted" :'user is muted'
            : 'user is kick',
        );
        if (type === 'mute') socket.emit('muteUser', res.data);
        if (type !== 'mute') {
          socket.emit('removeUser', res.data);
          if (type === 'block') dispatch(addNewBloxkedUser(res.data));
        }
      })
      .catch(({ response }) => {
        toast.error(response?.data?.message);
      });
  };

  const makeAdmin = () => {
    postData('/join/makeadmin', {
      ownerId: id,
      userId: data[1],
      roomId: data[0],
      isAdmin: !admin,
    })
      .then((res: any) => {
        toast.success(`admin ${!admin ? 'added' : 'removed'} `);
        socket.emit('makeAdmin', {
          name: res.data.chat.name,
          userId: data[1],
          type: admin,
        });
        setAdmin(!admin);
      })
      .catch(({ response }) => {
        toast.error(response?.data?.message);
      });
  };

  return (
    <div className="w-fulll text-white py-8 space-y-11">
      <button
        onClick={() => {
          setShowMembers(true);
        }}
      >
        <MoveLeft className="cursor-pointer" />
      </button>

      <div className="flex flex-col items-center ">
        <motion.div
          className="w-[100px] h-[100px] rounded-full overflow-hidden"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <Image
            src={data[2]}
            alt=""
            width={100}
            height={100}
            className="h-full"
             blurDataURL='/images/blur.jpg'
          />
        </motion.div>
        <motion.ul
          className="flex mt-9 gap-8"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.li
            className="cursor-pointer hover:text-green-200"
            title="Ban"
            variants={item}
            onClick={() => actionUser('block')}
          >
            <Ban />
          </motion.li>
          <motion.li
            className="cursor-pointer hover:text-green-200"
            title="make as admin" 
            variants={item}
            onClick={makeAdmin}
          >
            {!admin ? <ShieldCheck /> : <User />}
          </motion.li>
          <motion.li
            className="cursor-pointer hover:text-green-200"
            title="kick"
            variants={item}
            onClick={() => actionUser('kick')}
          >
            <UserX2 />
          </motion.li>
          <motion.li
            className="cursor-pointer hover:text-green-200"
            title="mute"
            variants={item}
            onClick={() => setMute(!showMute)}
          >
            <VolumeX />
          </motion.li>
        </motion.ul>
      </div>

      {showMute ? (
        <div>
          <p className="text-center text-sm mb-5 max-w-[90%] m-auto antialiased">
          A user cannot send messages in this group until you unmute or the mute time expires
          </p>
          <div className="flex flex-wrap justify-around gap-2">
            {mute.map((ele, index) => (
              <button
                onClick={() => actionUser('mute', ele.value)}
                key={index}
                className="bg-[#92AAFF] border border-[transparent] text-dark rounded-md px-2 py-1 hover:bg-dark-200 hover:border-white hover:text-white"
              >
                {ele.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export const MembersRoom = () => {
  const [showMembers, setShowMembers] = useState<boolean>(true);

  const { id } = useParams();

  const user = useSelector((state: any) => state.rooms);
  const [update, setUpate] = useState<any>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    getUSers();
  }, []);

  const getUSers = async () => {
    dispatch(fetchUserRoom([]));
    fetchGetData(`${entrypointUserRoom}${id}`)
      .then((res) => {
        dispatch(fetchUserRoom(res as userRoomDto[]));
      })
      .catch((err) => {err});
  };
  const goProfile = (
    roomId: number,
    userId: number,
    image: string,
    isAdmin: boolean,
  ) => {
    setUpate([roomId, userId, image, isAdmin]);
  };

  return (
    <div className="py-4 px-1 h-full">
      <div className="relative mt-4">
        <h1 className='p-2.5 w-full flex gap-2'> <User2/>  Members  ({user.userRoom.length})</h1>
        {/* <input
          className="p-2.5 w-full rounded-md border border-green/[.5] bg-dark-200 outline-0"
          placeholder="Search"
        />
        <button className=" absolute right-2 p-1 top-[50%] -translate-y-[50%]">
         <Search size={20} />
        </button> */}
      </div>

      {showMembers ? (
        <div className="mt-5 w-sm overflow-y-auto h-full scrollbar scrollbar-thumb-dark-100 scrollbar-track-dark-200 scrollbar-w-0 select-none">
          <motion.div>
            {user.userRoom.map((ele: userRoomDto) => (
              <UserChat
                key={ele.id}
                id={ele.userId}
                owner={ele.chat.ownerId}
                isAdmin={ele.isadmin}
                username={ele.userroom.UserName}
                type={
                  ele.chat.ownerId === ele.userId
                    ? 'owner'
                    : ele.isadmin
                    ? 'admin'
                    : 'member'
                }
                isOnline={ele.userroom.isOnline}
                mute={ele.timermute}
                image={ele.userroom.avatar}
                roomId={parseInt(id)}
                setShowMembers={setShowMembers}
                setUpate={goProfile}
              />
            ))}
          </motion.div>
        </div>
      ) : (
        <ApplyActionOnMember setShowMembers={setShowMembers} data={update} />
      )}
    </div>
  );
};
