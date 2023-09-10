'use client';
import { usePathname, useRouter } from 'next/navigation';

import NavBar from '@/components/navbar/NavBar';
import SideBar from '@/components/sidebar/SideBar';

import ChatBox from '@/components/chatBox/chatBox';
import axios from '../../api/axiosInstances';
import { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authLogin } from '@/redux_toolkit/auth';

import {
  addNewUser,
  createNewRoomSlice,
  muteUser,
  removeRoom,
  removeUserRoom,
  resetAllRoom,
  updateStutusUserRoom,
} from '@/redux_toolkit/rooms/roomsRedux';
import {
  addMessage,
  fetchMessage,
  lockedAction,
  resetAllMesage,
  setFoundRoom,
  settyping,
} from '@/redux_toolkit/rooms/messageRedux';

import { toast } from 'react-toastify';
import MessagetTypeDto from '../chat/dtoMessage';
import socket from '@/plugins/socket';
import { RoomMakeUser, RoomsDto } from '@/data/roomDto';
import { Loader2 } from 'lucide-react';
import { changeLastMessage } from '@/redux_toolkit/conversation/conversationSlice';
import ToastCont from './Toast';
import CustomToast from '../toast/CustomToast';

interface Props {
  chil: React.ReactNode;
  className: string;
}

export default function Childs({ chil, className }: Props) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const id = useSelector((state: any) => state.auth.id);
  const roomid = useSelector((state: any) => state.messages.roomId);
  const navigate = useRouter();

  const initAuthUser = () => {
    if (id) return;
    axios
      .post('/user')
      .then((res) => {
        dispatch(authLogin(res.data));

        return res.data;
      })
      .catch(({ response }) => {
        if (response?.data?.statusCode == 401) navigate.push('login');
      });
  };
  useEffect(() => {
    if (pathname === '/login') return;
    initAuthUser();
    if (!id) return;
    socket.emit('joinGlobal', id);
    function onConnect() {}

    const onDisconnect = () => {};

    const onMessageEvent = (value: any, data: MessagetTypeDto) => {
      value;
      dispatch(addMessage(data));
      if (id !== data.userId) {
        const runNotAudio = new Audio('/sound/pongster.mp3');
        if (runNotAudio)
            runNotAudio.play();
      }
    };
    const onAddNewUser = (data: userRoomDto) => {
      dispatch(addNewUser(data));
    };
    const onAddNewRoom = (data: RoomsDto) => {
        
      dispatch(createNewRoomSlice(data));
    };
    const onGlobalAdd = (data: any) => {
      if (id === data.userId) {
        
        dispatch(createNewRoomSlice(data));
        const runNotAudio = new Audio('/sound/new1.mp3');
        runNotAudio.play();
      }
    };

    const onRemoveUser = (data: userRoomDto) => {
      dispatch(removeUserRoom({ id: data.userId, roomId: data.roomId }));
      dispatch(removeRoom(data.id));
      if (id === data.userId) {
        socket.emit('leaveRoom', data.chat.name);
        dispatch(setFoundRoom({ type: true, roomId: data.roomId }));
      }
    };
    const onRemoveRoomdata = (data: userRoomDto) => {
      dispatch(removeRoom(data.id));
    };

    const onmakeAdmin = (data: RoomMakeUser) => {
      dispatch(updateStutusUserRoom(data.userId));
      if (id === data.userId && !data.type!)
        toast.info(`you are now as admin as room ${data.name}`);
    };
    const onMuteUser = (data: RoomMakeUser) => {
      dispatch(muteUser(data));
    };

    socket.on('totyping', (client, data) => {
      client;
      if (roomid !== data.roomId) return;
      dispatch(settyping(data.user));
      let timeOutId: any = null;
      clearTimeout(timeOutId);
      timeOutId = setTimeout(() => {
        dispatch(settyping(''));
      }, 2500);
    });

    const onMessage = (messageData: any) => {

      dispatch(
        changeLastMessage({
          id: messageData.senderid,
          message: messageData.message,
          msgId: messageData.id,
        }),
      );
    };

    // 
    socket.on('friend_invite', (id: number) => {
        const path_name = window.location.pathname;

        if (path_name === '/login' ||
            path_name === '/game' ||
            path_name === '/two-factor-verification' ||
            path_name === '/firsttime'||
            path_name === '/friend-game') {
                return;
            }

        toast(<CustomToast friend={id}/>, {
            autoClose: 8000,
            hideProgressBar: false,
            closeButton: false,
        })
    })

    socket.on('friend_not_invited', () => {
        toast.error('you are not invited to this game')
    })
  
    socket.on('start_friend_game', (data: any) => {
    
      localStorage.setItem('room', data.room)
      navigate.push('/friend-game')
  
    })

    //
    socket.on('onmessage', onMessage);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('messages', onMessageEvent);
    socket.on('notify', onAddNewUser);
    socket.on('removedUser', onRemoveUser);
    socket.on('addedRoom', onAddNewRoom);
    socket.on('getRoom', onGlobalAdd);
    socket.on('removeRoom', onRemoveRoomdata);
    socket.on('addedAdmin', onmakeAdmin);
    socket.on('isMuted', onMuteUser);
    return () => {
      socket.off('addedRoom', onmakeAdmin);
      socket.off('messages', onMessageEvent);
      socket.off('notify', onAddNewUser);
      socket.off('removedUser', onRemoveUser);
      socket.off('totyping', onRemoveUser);
      socket.off('isMuted', onMuteUser);
      dispatch(fetchMessage([]));
      dispatch(resetAllMesage());
      dispatch(resetAllRoom());
      dispatch(lockedAction(false));
      dispatch(setFoundRoom(false));
    };
   
  }, [id]);

  if (
    pathname === '/login' ||
    pathname === '/game' ||
    pathname === '/two-factor-verification' ||
    pathname === '/firsttime'||
    pathname === '/friend-game'
  ) {
    return (
      <html lang="en">
        <body className={`${className}`}>
          {' '}
          <ToastCont /> {chil}
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${className} flex text-white bg-dark`}>
        {' '}
        <ToastCont />
        <SideBar />
        <main className="bg-dark-100 w-screen min-h-screen flex flex-col md:ml-64">
          <NavBar />
          <div className="p-4 sm:p-8">
            <Suspense fallback={<Loader2 />}>{chil}</Suspense>

            <ChatBox />
          </div>
        </main>
      </body>
    </html>
  );
}
