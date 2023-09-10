'use client';

import RoomInfo from './_info_room';
import { useEffect } from 'react';
import Loding from './chat/Loding';
import fetchGetData from '@/data/fetchData';
import { entrypointMyRoom } from '@/data/entrypoint';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoom } from '@/redux_toolkit/rooms/roomsRedux';
import { RoomsDto } from '@/data/roomDto';

interface Props {
  hideBar: (type: boolean) => void;
}

const Rooms: React.FC<Props> = ({ hideBar }: Props) => {
  const userId = useSelector((state: any) => state.auth.id);
  const user = useSelector((state: any) => state.rooms);
  const dispatch = useDispatch();

  useEffect(() => {
    getdata();
  }, [userId]);

  const getdata = async () => {
    if (!userId) return;
    try {
      fetchGetData(`${entrypointMyRoom}${userId}`)
        .then((res) => {
          dispatch(fetchRoom(res as RoomsDto[]));
        })
        .catch((response) => {
            response;
          //TODO
        });
    } catch (error) {}
  };

  return (
    <div className="mt-[.5rem] w-full px-5">
      <div className="mt-[1rem] bg-green/[.3] h-[.1rem]"></div>
      {user.length != 0 ? <div className="py-5 font-medium">All Rooms </div> : null}

      <div
        className={`space-y-2 overflow-auto h-[16.5rem] scrollbar scrollbar-thumb-dark scrollbar-track-dark scrollbar-thumb-rounded-full scrollbar-w-1`}
        onClick={() => hideBar(false)}
      >
        {user.length === 0
          ? Array.from(Array(4), (i) => {
              return <Loding key={i} />;
            })
          : user.room.map((ele: any) => {
              return (
                <RoomInfo
                  key={ele.id}
                  id={ele.chat.id}
                  name={ele.chat.name}
                  avatar={ele.chat.avatar}
                />
              );
            })}
      </div>
    </div>
  );
};

export default Rooms;
