type chatRoomUserDto = {
    name: string;
    descreption: string;
    createAt: string;
    updatedAt: string;
    ownerId: number;
    avatar: string;
    id: number;
    type: string;
  };
  export interface RoomsDto  {
    albumId: number;
    id: number;
    chat: chatRoomUserDto;
    avatar: string;
    locked: boolean
  };




  export interface chatDto {
    ownerId: number;
    name: string;
  }
  
  export interface userroomDto {
    Username: string;
    id: number;
    avatar: string;
    isOnline: boolean;
  }
  
  export interface RoomSocketDto {
    id: number;
    createAt: string;
    updatedAt: string;
    userId: number;
    roomId: number;
    locked: boolean;
    isadmin: boolean;
    timermute: string;
    userroom: userroomDto;
    chat: chatDto;
  }
  
  export interface RoomMakeUser {
    name: string;
    userId: number;
    type: boolean;
  }
  