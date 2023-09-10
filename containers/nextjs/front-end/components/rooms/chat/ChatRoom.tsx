'use client';

import { RoomConverasation } from '../../chat/RoomConversation';

import { useState } from 'react';
import { MembersRoom } from './MembersRom';

import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import InviteUserRoom from './inviteuserRoom';
import UnBlock from './UnBlock';
import UpdateInfoRoom from './actions/Edit.room';
import { useSelector } from 'react-redux';
import NavBarConversation from '@/components/chat/Navbar';

export const ChatRoom = () => {
  // redux
  const { id } = useParams();
  const msg = useSelector((state: any) => state.messages);
  const infoRoom = useSelector((state: any) => state.rooms);

  const [switched, setSwitched] = useState<string>('chat');
  const [openBox, setOpenBox] = useState<boolean>(false);



  const SwitchPage = (switched: string) => {
    setSwitched(switched);
    setOpenBox(!openBox);
  };

  const chatRoom = (
    <motion.div
      className="h-full "
      initial={{ scale: 0.99 }}
      animate={{ scale: 1 }}
      transition={{
        ease: 'easeIn',
        duration: 0.1,
      }}
    >
      <RoomConverasation
        title={infoRoom.nameRoom}
      />
    </motion.div>
  );
  const contentMsg = msg.locked ? "room is protected by password" :"room notFound";
  return (
    <div className="h-full overflow-hidden ">
      {/* navbar chat */}
      {
      msg.onLoaddata ? null:
      !msg.locked && !msg.notFound ? (
        <NavBarConversation
          switched={switched}
          avatar={infoRoom.avatar}
          setOpenBox={setOpenBox}
          title={infoRoom.nameRoom}
          id={parseInt(id)}
          openBox={openBox}
          SwitchPage={SwitchPage}
          setSwitched={setSwitched}
        />
      ) : (
        <div className='text-center p-4 border-b-2 border-dark-100 mx-3 font-semibold'> {contentMsg}</div>
      )}

      {/* end navbar chat */}

      {switched === 'chat' ? (
        chatRoom
      ) : switched === 'member' ? (
        <MembersRoom />
      ) : switched === 'invite' ? (
        <InviteUserRoom roomId={parseInt(id)} />
      ) : switched === 'block' ? (
        <UnBlock />
      ) : switched === 'edit' ? (
        <UpdateInfoRoom id={parseInt(id)} />
      ) : null}
    </div>
  );
};
