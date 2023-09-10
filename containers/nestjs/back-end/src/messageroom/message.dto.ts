import { IsInt, IsString } from 'class-validator';

export class MessageRoomDto {
  @IsString()
  readonly message: string;
  @IsInt()
  userId: number;
  @IsInt()
  readonly roomId: number;
}

export class GetMessageRoomDto {
  @IsInt()
  readonly roomId: number;
  @IsInt()
  readonly userId: number;
  @IsInt()
  page?: number;
}

export class MessageSocketDto {
  roomId: number;
  userId: number;
  message: string;
  nameroom: string;
}
