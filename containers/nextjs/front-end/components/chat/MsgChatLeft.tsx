import moment from 'moment';
import Image from 'next/image';

interface MsgLeftProps {
  username: string;
  msg: string;
  avatar: string;
  time: string;
}
export const MsgChatLeft: React.FC<MsgLeftProps> = ({
  username,
  msg,
  avatar,
  time,
}: MsgLeftProps) => {
  return (
    <div className="flex items-start  mt-4">
        <Image
          src={avatar}
          height={50}
          width={50}
          alt="name"
           blurDataURL='/images/blur.jpg'
          className="mt-2 rounded-full border-[1.5px] border-green/50 h-12 w-12"
        />
      <div>
        <p className="mb-1 ml-3 text-xs text-green/50">
          {username} : {moment(time).fromNow()}
        </p>

        <p className="bg-[#FFCFCF]  p-1.5 rounded-xl max-w-xs text-black break-words ml-3 ">
          {msg}
        </p>
      </div>
    </div>
  );
};
