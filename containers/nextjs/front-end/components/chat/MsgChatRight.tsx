'use client';
import Image from 'next/image';

import { useState } from 'react';

interface MsgRightProps {
  msg: string;
  avatar: string;
}
export const MsgChatRight: React.FC<MsgRightProps> = ({
  msg,
  avatar,
}: MsgRightProps) => {

  const [readMore, setReadMore] = useState<boolean>(true);

  return (
    <div className="flex items-start mt-4  flex-row-reverse justify-start">
        
        <Image
        src={avatar}
        height={50}
        width={50}
        alt="user"
         blurDataURL='/images/blur.jpg'
        className="rounded-full border-[1.5px] border-green/50 h-12 w-12"
      />
     
     
      <p className="bg-[#92AAFF] p-2 mt-1.5 mr-3 max-w-xs rounded-xl text-black break-words">
        
        {
          msg.length > 100 && readMore ? (
            <>
              {msg.substring(0, 80)} ... <span className="text-[#F6F1F1] cursor-pointer text-sm" onClick={() => setReadMore(false)}>read more</span>
            </>
          )
          :
          msg.length > 100 && !readMore ? <> { msg } <span className="text-[#F6F1F1] cursor-pointer text-sm" onClick={() => setReadMore(true)}>read less</span> </> : msg
        }
        
      </p>
    </div>
  );
};
