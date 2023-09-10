import Image from "next/image";
import { useSelector } from "react-redux";

export default function UserInfo() {
    const user = useSelector((state: any) => state.auth)
  return (
    <div className="mt-12 flex flex-col items-center antialiased">
      <div className="h-[100px] w-[100px] rounded-full overflow-hidden">
        <Image   src={user.avatar} width={100} height={100} alt="user" className="w-full h-full object-cover"  blurDataURL='/images/blur.jpg'/>
      </div>
      <h3 className="text-2xl mt-4 break-words font-semibold">{user.UserName}</h3>
      <p className="text-green/[.5] mt-2 font-semibold">{user.bio}</p>
    </div>
  );
}
