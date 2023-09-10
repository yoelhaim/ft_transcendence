'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import axios from '@/api/axiosInstances';

import { useDispatch, useSelector } from 'react-redux';
import {
  setChanellId,
  setUser,
} from '@/redux_toolkit/conversation/conversationSlice';
import socket from '@/plugins/socket';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Dot, Gamepad2, Loader2, Search, Send } from 'lucide-react';
import { toast } from 'react-toastify';

interface UsersProps {
  name: string;
  image: string;
  bio: string;
  status: boolean;
  show: boolean;
  changestate: (status: boolean, name: string) => void;
  lastLogin: string;
  channelId: number;
}

interface ClientMessage {
  createdAt: string;
  message: string;
  senderid: string;
}

export const UserBlock = ({
  name,
  image,
  bio,
  status,
  show,
  lastLogin,
  changestate,
  channelId,
}: UsersProps) => {
  const dispatch = useDispatch();

  const add = () => {
    dispatch(setUser({ id: channelId, fullName: name, avatar: image } as any));
    changestate(!show, name);
  };

  return (
    <div
      key={1}
      className={`flex justify-between mt-4 cursor-pointer items`}
      onClick={() => add()}
    >
      <div className="flex ">
        <Image
          src={image}
          alt=""
          height={50}
          width={50}
           blurDataURL='/images/blur.jpg'
          className=" border-[2px] rounded-full border-[#006699] h-12 w-12"
        />
        <div className="ml-3">
          <h3 className="text-lg">{name} </h3>
          <h1 className="text-sm text-[#006699] overflow-hidden text-ellipsis truncate w-[220px]">
            {bio}
          </h1>
        </div>
      </div>
      <div className="flex flex-col justify-around">
        <div className="ml-4 grid place-content-start">
          {status ? (
            <Dot className="text-green-100" size={30} />
          ) : (
            <Dot className="text-red" size={30} />
          )}
        </div>
        <h1 className="text-[11px] text-[#006699] truncate w-[50px]">
          {lastLogin}{' '}
        </h1>
      </div>
    </div>
  );
};

interface SearchProps {
  setFriendsList: (param: any, search: string) => void;
}

export const SearchBar = ({ setFriendsList }: SearchProps) => {
  const [search, setSearch] = useState<string>('');

  const serachforFriend = () => {
    axios
      .get(`/game/friends/${search}`)
      .then((res) => {
        setFriendsList(res.data, search);
      })
      .catch((err) => err);
  };

  return (
    <div className="relative h-10 mt-3 mb-2 max-sm:m-0 max-sm:mt-3">
      <input
        type="text"
        name="search"
        placeholder="Search"
        className="px-2 bg-dark-200 rounded-lg border-[1px] border-white  h-full outline-none w-full "
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        className="absolute top-[50%] -translate-y-[50%] right-2"
        onClick={serachforFriend}
      >
        <Search size={20} />
      </button>
    </div>
  );
};

export const TextBox = ({ senderid, createdAt, message }: ClientMessage) => {
  let te = useSelector((state: any) => state.auth.id);

  return (
    <div className="mt-5">
      <h3
        className={`${
          senderid == te ? 'ml-10' : 'mr-10'
        } mx-2 text-xs text-white ${
          senderid == te ? 'text-right' : 'text-left'
        }`}
      >
        {' '}
        {moment(createdAt).fromNow()}{' '}
      </h3>
      <div
        className={`${
          senderid == te ? 'bg-[#92AAFF]' : 'bg-[#846cde]'
        }  p-2  w-30 break-words max-w-20 rounded-3xl  ${
          senderid == te ? 'ml-10' : 'mr-10'
        }`}
      >
        <span>
          {message}
          <div></div>
        </span>
      </div>
    </div>
  );
};

export const ChatBoxs = () => {
  const { id } = useSelector((state: any) => state.conversation);
  const dispatch = useDispatch();
  const userRoomId = useSelector((state: any) => state.conversation.chatId);
  const userid = useSelector((state: any) => state.auth.id);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasmore] = useState<boolean>(true);

  const elementRef = useRef<HTMLDivElement>(null);
  const [heigth, setH] = useState<number>(0);
  const [isExits, setIsExist] = useState<boolean>(true);



  const challenge = () => {
    if (id == undefined) return;

    const data = {
      authUser: userid,
      checked: id,
    };

    socket.emit('invite', data);
  };

  useEffect(() => {
    const element = elementRef?.current;

    if (!element) return;

    const observer = new ResizeObserver(() => {
      setH(element.offsetHeight - 50);
    });

    observer.observe(element);
    return () => {
      // Cleanup the observer by unobserving all elements
      observer.disconnect();
    };
  }, []);

  const fetchmore = () => {
    axios
      .get(`/list/mesage/${userid}/${id}/${page}`)
      .then((res) => {
        setPage(page + 1);
        if (res.data[0].channel.length === 0) setHasmore(false);
        setTimeout(() => {
          setListemessage((listmessage: any) => [
            ...listmessage,
            ...res.data[0].channel,
          ]);
        }, 1000);
      })
      .catch(({ response }) => {
        toast.error(`${response?.data?.message}`);
      });
  };
  useEffect(() => {
    axios
      .get(`/list/mesage/${userid}/${id}/${page}`)
      .then((res) => {
        setPage(page + 1);
        setListemessage(res.data[0].channel);
        dispatch(setChanellId(res.data[0].id));
        socket.emit('joinPrivate', res.data[0].id.toString());
      })
      .catch(({response}) => {
        // toast.error(`${response?.data?.message}`)
        if (response?.data?.statusCode === 403 )
            setIsExist(false);
      });
  }, []);

  const bottom = useRef<HTMLDivElement>(null);
  const [listmessage, setListemessage] = useState<ClientMessage[]>([]);
  const [message, setMessage] = useState<string>('');

  function sendMessage(event: any) {
    event.preventDefault();
    if (message.length === 0) return;
    const mm = {
      senderid: userid,
      receiverid: id,
      time: new Date().toString(),
      message: message,
      chatId: userRoomId,
    };
    axios.post('/list/addMessages', mm).then((res) => {
        if (res.data.isFirst)
        {
            setListemessage((listmessage: any) => [mm, ...listmessage]);
            dispatch(setChanellId(res.data.data.chatId));
            socket.emit('joinPrivate', res.data.data.chatId.toString());
        }


    }).catch(({response}) => {
        toast.error(`${response?.data?.message}`);
    });
    setMessage('');

    bottom.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'end',
    });
  }

  
  useEffect(() => {
    if (!userRoomId) return;
    function OnAdd(messageData: any) {
      setListemessage((listmessage: any) => [messageData, ...listmessage]);
      // dispatch(changeLastMessage({ id: messageData.receiverid, message: messageData.message, msgId: messageData.id }))
    }
    socket.on('privatechatMsg', OnAdd);
    return () => {
      socket.off('privatechatMsg', OnAdd);
      socket.emit('leavePrivte', userRoomId.toString());
    };
  }, [socket, userRoomId]);

  return (
    <div
      className={`bg-[#393A6C] flex flex-col justify-end  h-full ${
        isExits ? 'block' : 'hidden'
      }`}
      ref={elementRef}
    >
    {
        listmessage.length  ? (
            <div className=" h-full overflow-y-auto scrollbar scroll">
            <div
              id="scrollableDivChat"
              className="overflow-auto flex flex-col-reverse  scrollbar  "
              style={{ height: heigth }}
              ref={bottom}
            >
              <InfiniteScroll
                className="flex flex-col-reverse scrollbar"
                dataLength={listmessage.length}
                scrollableTarget="scrollableDivChat"
                next={fetchmore}
                hasMore={hasMore}
                inverse={true}
                loader={
                  <div className="grid place-content-center m-2">
                    <Loader2 className="animate-spin" />
                  </div>
                }
              >
                {listmessage.map((Element: ClientMessage, index: number) => (
                  <TextBox
                    key={index}
                    senderid={Element.senderid}
                    createdAt={Element.createdAt}
                    message={Element.message}
                  />
                ))}
              </InfiniteScroll>
            </div>
          </div>
        ): null
    }
      <div className="p-1 relative bottom-0">
        <form autoComplete='false' onSubmit={sendMessage}
        name='friendchat_form'
        id='friendchat_form'
        >
          <input
            autoComplete="off"
            id="messagebar"
            type="text"
            className="bg-[#393A6C] w-full  p-2 rounded-md outline-none border-[1px] border-white"
            onChange={(r) => setMessage(r.target.value)}
            placeholder="type here"
            value={message}
          />
        </form>
        <div className="absolute right-4 top-[50%] -translate-y-[50%] flex justify-start items-center gap-1 ">
          <button className="" onClick={sendMessage}>
            <Send className="rotate-45 p-1" size={30} />
          </button>
          <button
            type="button"
            className=""
            onClick={challenge}
        >
            <Gamepad2 size={30} />
          </button>
        </div>
      </div>
    </div>
  );
};
