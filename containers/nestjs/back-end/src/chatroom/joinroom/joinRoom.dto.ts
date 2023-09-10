import { IsInt, IsString } from 'class-validator';

export class BlockUserDto {
  @IsInt()
  userId: number;

  @IsInt()
  roomId: number;

  @IsInt()
  adminId: number;

  @IsString()
  type?: string;

  @IsInt()
  timer?: number;
}
