
import Image from 'next/image';
import Link from 'next/link';

interface RoomInfoProps {
  name: string;
  avatar: string;
  id: number;
}

const RoomInfo: React.FC<RoomInfoProps> = ({
  id,
  name,
  avatar,
}: RoomInfoProps) => {
  return (
    <Link href={`/rooms/${id}`}>
      <div className="flex items-center p-1.5 pl-3 font-medium text-left text-white bg-dark-200 rounded-lg border-2 border-green/[.2] mt-4">
        <Image
          loading='lazy'
          placeholder="empty"
          quality={100}
           blurDataURL='/images/blur.jpg'
          className="rounded-full border-[2px] border-green/[.2] w-10 h-10"
          src={`${avatar}`}
          height={40}
          width={40}
          alt="room"
        />
        <span
          className="text-md ml-2 font-medium truncate text-ellipsis overflow-hidden mr-2"
          title={name}
        >
          {name}
        </span>
      </div>
    </Link>
  );
};

export default RoomInfo;
