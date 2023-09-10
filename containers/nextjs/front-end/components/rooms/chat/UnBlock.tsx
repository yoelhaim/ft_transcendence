'use client';
import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import fetchGetData from '@/data/fetchData';
import {
  entrypointBlockRoom,
  entrypointUnBlockUserRoom,
} from '@/data/entrypoint';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBlockedUserRoom,
  removeBlockedUserRoom,
} from '@/redux_toolkit/rooms/roomsRedux';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from '@/api/axiosInstances';
import { DoorOpen, Loader2 } from 'lucide-react';

export default function UnBlock() {
  const { id } = useParams();

  const user = useSelector((state: any) => state.rooms);
  const ownerId = useSelector((state: any) => state.auth.id);
  const [update, setUpate] = useState<boolean>(false);
  const dispatch = useDispatch();
  useEffect(() => {
    getUSers();
  }, []);

  const getUSers = async () => {
    fetchGetData(`${entrypointBlockRoom}${id}`)
      .then((res) => {
        dispatch(fetchBlockedUserRoom(res as userRoomDto[]));
      })
      .catch(() => {
        toast.error('error Block');
      });
  };
  const unblock = (userId: number, roomId: number) => {
    try {
      setUpate(true);
      axios
        .post(entrypointUnBlockUserRoom, {
          userId: userId,
          roomId: roomId,
          adminId: ownerId,
        })
        .then((res) => {
          toast.info(' user removed  the black list ');
          dispatch(removeBlockedUserRoom(res.data.userId));
          setUpate(false);
        })
        .catch(({ response }) => {
          toast.error(response?.data?.message);
          setUpate(false);
        });
    } catch (err) {
      toast.error('error ');
    }
  };
  return (
    <div className="py-4 px-4 h-full">
      <div className="text-md my-3">List blocked :</div>
      <div className="overflow-hidden h-full">
        {!user.userBlockedRoom.length ? (
          <div className="text-center">no user blocked found</div>
        ) : (
          user.userBlockedRoom.map((ele: any) => {
            return (
              <div
                key={ele.id}
                className="flex justify-between items-center gap-4 py-2"
              >
                <div className="flex items-center gap-2 ">
                  <Image
                    src={ele.userroom.avatar}
                    alt="Rooms"
                    width={50}
                    height={50}
                    className="rounded-full h-10 w-10"
                     blurDataURL='/images/blur.jpg'
                  />
                  <span>{ele.userroom.UserName}</span>
                </div>
                <button
                  className="bg-green text-dark px-2 py-2 rounded-md flex gap-2 "
                  onClick={() => unblock(ele.userId, ele.roomId)}
                >
                  {update ? (
                    <Loader2 className=" animate-spin" />
                  ) : (
                    <DoorOpen />
                  )}{' '}
                  unblock
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
