import Image from 'next/image';
import { BoxChat } from '../rooms/chat/BoxChat';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { ArrowLeft, Settings } from 'lucide-react';
export interface propsCoverNav {
  switched: string;
  avatar: string;
  setOpenBox: (open: boolean) => void;
  title: string;
  id: number;
  openBox: boolean;
  SwitchPage: (switched: string) => void;
  setSwitched: (switched: string) => void;
}

const NavBarConversation = ({
  switched,
  avatar ,
  setOpenBox,
  title,
  id,
  SwitchPage,
  setSwitched,
  openBox,
}: propsCoverNav) => {
    const user = useSelector((state: any)=> state.rooms.userRoom)
   
  return (
    <div
      className={` bg-dark-100 p-2 m-2 px-5 rounded-md flex   items-center ${
        switched === 'chat' ? '' : 'flex-row-reverse'
      }`}
    >
      <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.5 }}>
        <Image
          className="rounded-full object-fill w-12 h-12"
          src={avatar}
          alt="Rooms"
          width={50}
          height={50}
           blurDataURL='/images/blur.jpg'
        />
      </motion.div>

      <div
        className={`flex justify-between  w-full relative  ${
          switched === 'chat' ? '' : 'flex-row-reverse'
        }`}
      >
        <div className='mx-3'>
        <p >{title}</p>
        <h5 className="text-xs text-white/50 ">{user.length} memebers</h5>
        </div>
        {switched === 'chat' ? (
          <button onClick={() => setOpenBox(!openBox)} className="outline-none">
            <Settings size={20}/>
          </button>
        ) : (
          <button onClick={() => setSwitched('chat')}>
            <ArrowLeft size={20}/>
          </button>
        )}
        {
            openBox? <BoxChat setSwitched={SwitchPage} roomId={id} /> : null
        }
      </div>
    </div>
  );
};
export default NavBarConversation;
