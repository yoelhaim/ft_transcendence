'use client';
import { CheckCircle2, CircleSlash, Loader2, UserPlus2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useSelector } from 'react-redux';

interface propsInvite {
  avatar: string;
  id: number;
  userLength: number;
  blockLength: number;
  UserName: string;
  inviteUserAction: (id: number)=> void

}
const InviteContainrs = ({
  avatar,
  id,
  userLength,
  blockLength,
  UserName,
  inviteUserAction
}: propsInvite) => {
    const loading = useSelector((state: any)=> state.rooms.loading)
    const [invite, setInvite] = useState<boolean>(false)
  return (
    <div className="bg-dark-100 w-full flex p-4 rounded-md justify-between">
      <div className="flex gap-2 items-center">
        <Image
          height={50}
          width={50}
          src={avatar}
          alt="user"
          className="rounded-full w-11 h-11"
           blurDataURL='/images/blur.jpg'
        />
        <p>{UserName} </p>
      </div>
      {userLength || invite ? (
        <button
          disabled
          className="bg-green-300 my-2 p-2 w-lg rounded-lg flex gap-1 justify-center items-center"
        >
          <CheckCircle2 /> invited
        </button>
      ) : blockLength ? (
        <button
          disabled
          className="bg-red my-2 p-2 w-lg rounded-lg flex gap-1 justify-center items-center"
        >
          <CircleSlash /> blocked
        </button>
      ) : (
        <button
          className="bg-green-100 m-2 p-2 w-lg rounded-lg flex gap-1 justify-center items-center"
          onClick={async() => {inviteUserAction(id); setInvite(true)}  }
        >
          {loading !== id  ? <UserPlus2 /> : <Loader2 className="animate-spin" />} Invite
        </button>
      )}
    </div>
  );
};
export default InviteContainrs