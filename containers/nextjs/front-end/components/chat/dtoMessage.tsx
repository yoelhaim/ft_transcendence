
type usermsg = {
  UserName: string;
  id: number;
  createAt: string;
  updatedAt: string;
  avatar: string;
};
type MessagetTypeDto = {
  id: number;
  message: string;
  roomId: number;
  createAt: string;
  userId: number,
  usermsg: usermsg
};
export default MessagetTypeDto;
