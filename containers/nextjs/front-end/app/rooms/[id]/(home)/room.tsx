import { ChatRoom } from '@/components/rooms/chat/ChatRoom';
import { MembersRoom } from '@/components/rooms/chat/MembersRom';

export const LaunchRoom = () => {
  return (
    <div className="flex gap-2 h-[calc(100vh-150px)] overflow-hidden">
      <div className="bg-dark-200 w-[500px] lg:max-w-sm  hidden lg:block">
        <MembersRoom />
      </div>
      <div className="bg-dark-200 w-full">
        <ChatRoom />
      </div>
    </div>
  );
};
