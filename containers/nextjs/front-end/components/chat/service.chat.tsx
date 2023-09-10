import { MsgChatLeft } from './MsgChatLeft';
import { MsgChatRight } from './MsgChatRight';
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import MessagetTypeDto from './dtoMessage';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loader2, Send } from 'lucide-react';
import axios from 'axios';
import { entrypointMsgRoom } from '@/data/entrypoint';
import { fetchMessage } from '@/redux_toolkit/rooms/messageRedux';

interface ServiceRoomProps {
  // inputs
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  sendMessage: (e: any) => void;
  setTyping: (type: boolean) => void;
  sethasMore: (type: boolean) => void;
  id: number;
  userId: number;
  hasMore: boolean;
}

const ServiceMessageRomm = ({
  message,
  setMessage,
  sendMessage,
  userId,
  hasMore,
  sethasMore,
  id,
  setTyping,
}: ServiceRoomProps) => {
  const userName = useSelector((state: any) => state.auth.UserName);
  const messageConv = useSelector((state: any) => state.messages);
  const [page, setpage] = useState<number>(1);
  const elementRef = useRef<HTMLDivElement>(null);
  const [heigth, setH] = useState<number>(0);

 
  useEffect(() => {
    const element = elementRef?.current;

    if (!element) return;

    const observer = new ResizeObserver(() => {
      setH(element.offsetHeight - 150);
    });

    observer.observe(element);
    return () => {
      // Cleanup the observer by unobserving all elements
      observer.disconnect();
    };
  }, []);

  const dispatch = useDispatch();
  const moreData = async () => {
    try {
      setpage(page + 1);
      const data = await axios.get(
        `${entrypointMsgRoom}${id}/${userId}/${page}`,
      );
      if (!data.data.MessageRooms.length) sethasMore(false);
      setTimeout(() => {
        dispatch(
          fetchMessage([
            ...new Set([...messageConv.messages, ...data.data.MessageRooms]),
          ]),
        );
      }, 700);
    } catch (error) {
      sethasMore(false);
    }
  };

  return (
    <div className="relative h-full flex flex-col px-4 " ref={elementRef}>

      <div
        id="scrollableDiv"
        className="overflow-auto flex flex-col-reverse  scrollbar"
        style={{ height: heigth}}
      >
        <InfiniteScroll
          className="flex flex-col-reverse scrollbar"
          dataLength={messageConv.messages.length}
          next={moreData}
          hasMore={hasMore}
          scrollableTarget="scrollableDiv"
          inverse={true}
          loader={
            <div className="grid place-content-center m-5">
              {hasMore ? <Loader2 className=" animate-spin" /> : null}
            </div>
          }
        >
          {!messageConv.messages.length ? (
            <div className="flex items-center justify-center h-full">
              no messages
            </div>
          ) : (
            messageConv.messages.map((ele: MessagetTypeDto, i: number) => {
              return (
                <div key={i}>
                  {ele.userId !== userId ? (
                    <MsgChatLeft
                      msg={ele.message}
                      username={ele.usermsg.UserName}
                      avatar={ele.usermsg.avatar}
                      time={ele.createAt}
                    />
                  ) : (
                    <MsgChatRight
                      msg={ele.message}
                      avatar={ele.usermsg.avatar}
                    />
                  )}
                </div>
              );
            })
          )}
        </InfiniteScroll>
      </div>
      <div className="sticky bottom-0 w-full px-1 md:px-7 p-2 mt-20">
        <div className="my-3 rounded-xl text-white/70 text-sm  w-30">
          {messageConv.typing && messageConv.typing != userName
            ? `${messageConv.typing} is typing ...`
            : null}
        </div>
        {
          <div className="relative ">
            <form autoComplete='false'
             onSubmit={(e: any) => sendMessage(e)}
             name='message_formRoom'
             id='message_formRoom'
            >
              <input
                name='messagesender'
                id='messagesenderId'
                value={message}
                className="p-2.5 w-full h-full rounded-md outline-none border border-white bg-dark-200"
                placeholder="Type here..."
                onChange={(e) => {
                  setMessage(e.target.value);
                  setTyping(true);
                }}
              />

              <button
                type="submit"
                className="absolute right-2 bg-[#5D5FEF] top-[50%] -translate-y-[50%] p-1.5 rounded-md"
              >
                <Send size={22} className='rotate-45 -translate-x-0.5'/>
              </button>
            </form>
          </div>
        }
      </div>
    </div>
  );
};
export default ServiceMessageRomm;
