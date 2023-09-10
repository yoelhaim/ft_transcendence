import { Optional } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { IsString, Length } from 'class-validator';

export class ChatRoomDto {
  @IsString()
  @Length(5, 100)
  name: string;
  @IsString()
  @Length(5, 1000)
  descreption: string;
  @Optional()
  avatar?: Express.Multer.File;
  @IsString()
  type: string;
  @IsString()
  password?: string;
  @IsString()
  ownerId: string;
  image?: string;
}
export class UpdateRoomDto extends PartialType(ChatRoomDto) {}

export class chatDto {
  ownerId: number;
  name: string;
}

export class userroomDto {
  Username: string;
  id: number;
  avatar: string;
  isOnline: boolean;
}

export class RoomSocketDto {
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

export class RoomMakeUser {
  name: string;
  userId: number;
  type: boolean;
}
