import Link from "next/link";
import { Users } from "lucide-react";


export const CreateRoom = () => {
  return (

    <div className="mt-16 mx-5">
    <Link href="/rooms/createroom">

      <div
        className="p-[1px] text-black rounded-[2rem] cardCreate">
        <div
          className=" py-10 px-6 rounded-[2rem] cursor-pointer cardCreate2">

          <div className="relative bg-red"></div>
          <div className="flex flex-col antialiased">
           <Users size={40} color="white"/>
            <h3 className="pt-2 text-1xl font-semibold text-white">
              Create Room
            </h3>
            <p className="pt-2 text-sm font-semibold text-white/40 ">
              Personalized game experience
            </p>
          </div>
        </div>
      </div>
    </Link>
    </div>
  );
};

