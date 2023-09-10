'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ServiceMessageRomm from './service.chat';
import socket from '@/plugins/socket';
import fetchData from '../../data/fetchData';
import { entrypointMsgRoom } from '@/data/entrypoint';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchMessage,
  initailIdRoom,
  lockedAction,
  setFoundRoom,
} from '@/redux_toolkit/rooms/messageRedux';
import ConfirmPassword from './ConfirmPassword';
import NotFoundRoom from './NotFoundRoom';
import Loadingdata from './LoadinData';
import {
  initailRoomId,
  setAvatarRoom,
  setTitleRoom,
} from '@/redux_toolkit/rooms/roomsRedux';
import axios from 'axios';

interface converProprs {
  title: string;
}

export const RoomConverasation = ({ title }: converProprs) => {
  const { id } = useParams();




  const [message, setMessage] = useState<string>('');

  // redux
  const dataUser = useSelector((state: any) => state.auth);
  const messageConv = useSelector((state: any) => state.messages);
//   const rooms = useSelector((state: any) => state.rooms);
  const dispatch = useDispatch();


  const [hasMore, setHasMore] = useState<boolean>(true);

  const sendMessage = async (e: ChangeEvent<HTMLDataElement>) => {
    e.preventDefault();

    if (message.trim() !== '' || message.trim().length != 0) {
      const data = {
        roomId: parseInt(id),
        userId: parseInt(dataUser.id),
        message: message,
        // nameroom: title,
      };
      axios.post('/chatroom/addMessage', data).then((res) => {
        res;
      }).catch((err) => {
        err;
        });
    //   socket.emit('sendMessages', data);
    }

    setMessage('');

  };

  const dispatchData = (res: any) => {
    dispatch(setTitleRoom(res.name));
    dispatch(setAvatarRoom(res.avatar));
    dispatch(fetchMessage(res.MessageRooms));
    dispatch(setFoundRoom({ type: false, roomId: id}));
    
  };

  const InitailDataRender = () => {
    if (!dataUser.id) return;
    dispatch(initailIdRoom(parseInt(id)));
    dispatch(initailRoomId(parseInt(id)));
    fetchData(`${entrypointMsgRoom}${id}/${dataUser.id}`)
      .then((res: any) => {
        socket.emit('join', { nameroom: res.name });
        dispatchData(res);
        if (!res.MessageRooms.length)
            setHasMore(false)
      })
      .catch((response?) => {
        if (
          response?.statusCode === 403 &&
          response?.message === 'required password'
        )
          dispatch(lockedAction(true));
        else dispatch(setFoundRoom({type: true, roomId: id}));

      });
  };


  useEffect(() => {
    InitailDataRender();
    return ()=>{
      
    }
  }, [dataUser.id]);

  const setTypingMessage = () => {
    socket.emit('typing', {
      userId: dataUser.id,
      roomId: id,
      nameroom: title,
      user: dataUser.UserName,
    });
  };

  return (
    <>
      <div className="flex justify-center"></div>

      {messageConv.onLoaddata ? (
        <Loadingdata />
      ) : messageConv.locked ? (
        <ConfirmPassword
          roomId={parseInt(id)}
          userId={dataUser.id}
          InitailDataRender={InitailDataRender}
        />
      ) : messageConv.notFound ? (
        <NotFoundRoom />
      ) : (
        <ServiceMessageRomm
          setTyping={setTypingMessage}
          message={message}
          id={parseInt(id)}
          sendMessage={sendMessage}
          setMessage={setMessage}
          userId={dataUser.id}
          hasMore={hasMore}
          sethasMore={setHasMore}
        />
      )}
    </>
  );
};
