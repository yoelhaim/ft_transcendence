'use client';

import React, { useState, forwardRef } from 'react';
import { Loader2, Check, Plus, X } from 'lucide-react';
import Image from 'next/image';

import { useInput } from '@/hooks/customHooks';
import axios from '@/api/axiosInstances';
import { useDispatch, useSelector } from 'react-redux';
import { createNewRoomSlice } from '@/redux_toolkit/rooms/roomsRedux';
// import CardProps from '@/types/CardRoom'

interface CardProps {
  name: string;
  description: string;
  avatar: string;
  type: string;
  roomId: number;
}

interface JoinProps {
  loading: boolean;
  joinRoom: () => void;
  joined: boolean;
  codeError: boolean;
}

function JoinButton({
  loading,
  joinRoom,
}: {
  loading: boolean;
  joinRoom: () => void;
}) {
  return (
    <button
      className="flex items-center bg-[#644DEA] font-medium w-full h-full justify-center rounded-lg"
      onClick={joinRoom}
      disabled={!loading}
    >
      {loading ? (
        <>
          Join <Plus className="ml-2" />
        </>
      ) : (
        <Loader2 className="animate-spin" />
      )}
    </button>
  );
}

function JoinFailed() {
  return (
    <button className="flex items-center bg-[#F87171] font-medium w-full h-full justify-center rounded-lg">
      Failed <X className="ml-2" />
    </button>
  );
}

function JoinedSuccess() {
  return (
    <button className="flex items-center bg-[#53D397] font-medium w-full h-full justify-center rounded-lg">
      Joined <Check className="ml-2" />
    </button>
  );
}

function Join({ loading, joinRoom, joined, codeError }: JoinProps) {
  return (
    <>
      {!joined ? (
        !codeError ? (
          <JoinButton loading={loading} joinRoom={joinRoom} />
        ) : (
          <JoinFailed />
        )
      ) : (
        <JoinedSuccess />
      )}
    </>
  );
}

const Card = forwardRef( ({ name, description, avatar, type, roomId }: CardProps, ref?: React.Ref<HTMLDivElement>) => {
   ref;
    const [loading, setLoading] = useState<boolean>(true);
    const [joined, setJoined] = useState<boolean>(false);
    const [codeError, setCodeError] = useState<boolean>(false);
    const dispatch = useDispatch();

    const [roomCode, setRoomCode, onChangeCode] = useInput<string>('');
    setRoomCode;

    const authUser = useSelector((state: any) => state.auth.id);

    const joinRoom = () => {
      setLoading(false);

      const data: any = {
        userId: authUser,
        roomId: roomId,
      };

      if (type === 'protected') data.password = roomCode;

      axios
        .post('/join/joined/', data)
        .then((res) => {
          setLoading(true);
          setCodeError(false);
          setJoined(true);

          dispatch(createNewRoomSlice(res.data));
        })
        .catch((err) => {
            err;
          setLoading(true);
          setCodeError(true);

          setTimeout(() => {
            setCodeError(false);
          }, 2000);
        });
    };

    return (
      <div
        ref={ref}
        className="bg-[#012140] rounded-2xl p-6 text-[#EDEDED] flex flex-col justify-between"
      >
        <div className="h-[200px] relative">
          <Image
            src={avatar}
            width={500}
            height={500}
            alt="#"
            className="w-full h-full object-cover rounded-xl"
             blurDataURL='/images/blur.jpg'
          />
          <span className="uppercase absolute bottom-[10px] right-[15px] bg-gradient-to-r from-[#282950] to-[#644DEA] px-4 py-2 rounded-lg  font-medium">
            {type}
          </span>
        </div>
        <div className="mt-8 h-full flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-medium ">{name}</h3>
            <p className="mt-2 text-[#707D93] break-words">
              {description.length > 100
                ? description.substring(0, 100)
                : description}
            </p>
          </div>

          <form
            className="flex items-center justify-between mt-4 gap-4 h-[50px]"
            name={`_${roomId}__joinded`}
            id={`_${roomId}__joinded`}
            autoComplete='off'
            >
                 <input hidden type='text' name='email' autoComplete='email' />
            {type === 'protected' && !joined ? (
              <>
              
                <input
                  type="password"
                  placeholder="Invite Code"
                  className="w-full h-full rounded-lg bg-[#1A1D2A] text-[#707D93] px-4 py-2 outline-[#707D93] focus:outline-double"
                  value={roomCode}
                  onChange={onChangeCode}
                  autoComplete="new-password"
                  id={`_${roomId}__code`}
                name={`_${roomId}__code`}
                ng-hidden="true"
                />
              </>
            ) : null}

            <Join
              loading={loading}
              joinRoom={joinRoom}
              joined={joined}
              codeError={codeError}
            />
          </form>
        </div>
      </div>
    );
  },
);

Card.displayName = 'Card';

export default Card;


