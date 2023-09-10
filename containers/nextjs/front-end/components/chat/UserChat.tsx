'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Cog, Dot, VolumeX } from 'lucide-react';
import {  useSelector } from 'react-redux';
interface MemberChatProps {
  username: string;
  id: number;
  image: string;
  type: string;
  isOnline: string;
  isAdmin: boolean;
  roomId: number;
  setShowMembers: (para: boolean) => void;
  setUpate: (
    roomId: number,
    userId: number,
    image: string,
    isAdmin: boolean,
  ) => void;
  mute: string;
  owner: number;
}

const UserChat: React.FC<MemberChatProps> = ({
  id,
  username,
  image,
  owner,
  type,
  isOnline,
  isAdmin,
  roomId,
  setShowMembers,
  setUpate,
  mute,
}: MemberChatProps) => {
  const userId = useSelector((state: any) => state.auth.id);
  const userRoom = useSelector((state: any) => state.rooms.userRoom);
  let countDowntimer = parseInt(mute) - Math.floor(Date.now() / 1000);


  return (
    <div className="flex w-full p-2 items-center">
      <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 1.3 }}>
        <Image
          src={image}
          alt="image"
          width={50}
          height={50}
           blurDataURL='/images/blur.jpg'
          className=" rounded-full border-[1.5px] border-green/50 h-12 w-12"
        />
      </motion.div>
      <>
        <div className="mx-2.5 flex-1">
          <Link
            href={`/member/${username}`}
            title={username}
            className=" pr-1 w-[100px] font-semibold truncate text-ellipsis  overflow-hidden"
          >
            {username}
          </Link>
          <p title={type} className="text-sm text-white/40 ">
            {type}
          </p>
        </div>
        <div className="flex gap-3 items-center">
          {countDowntimer > 0 ? <VolumeX size={20} color="red" /> : null}
          {userRoom.map((ele: any) => ele.userId).indexOf(userId) !== -1 &&
          userRoom[userRoom.map((ele: userRoomDto) => ele.userId).indexOf(userId)]
            .isadmin &&
          userId !== id &&
          id !== owner ? (
            <button
              onClick={() => {
                setShowMembers(false);
                setUpate(roomId, id, image, isAdmin);
              }}
            >
              <Cog width={15} />
            </button>
          ) : null}

          {isOnline !== 'offline'  ? <Dot className="text-green-100" size={30} /> : <Dot className="text-red" size={30} />}
        </div>
      </>
    </div>
  );
};

export default UserChat;
