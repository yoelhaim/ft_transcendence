import Image from 'next/image';

import FormJoinRoom from '@/components/forms/FormJoinRooms';

const joinRooms = () => {
  return (
    <div className="mx-0 md:mx-16 p-4 bg-dark grid place-items-center mt-10 ">
      <h2 className="text-lg font-semibold">Join room : Pongster Room</h2>

      <div className="p-2">
        <Image
          className="mx-auto"
          src="/img/profile.svg"
          width={100}
          height={100}
          alt="room"
           blurDataURL='/images/blur.jpg'
        />

        {/* <h3>this room protected by password</h3> */}
        <FormJoinRoom />
      </div>
    </div>
  );
};
export default joinRooms;
