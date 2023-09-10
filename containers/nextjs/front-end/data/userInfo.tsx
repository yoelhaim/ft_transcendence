
type userroom = {
  UserName: string;
  avatar: string;
  isOnline: string;
  id: number
};
type chat = {
  ownerId: number;
  id: number,
  name? : string,
};

type userRoomDto = {
  id: number;
  createAt: string;
  updatedAt: string;
  userId: number;
  roomId: number;
  locked: boolean;
  isadmin: boolean;
  timermute: string;
  userroom: userroom;
  chat: chat;
  
};
