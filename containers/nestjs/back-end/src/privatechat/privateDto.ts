import { IsInt, IsString } from "class-validator";

export class privateMessageDto {
    @IsInt()
    senderid: number;

    @IsInt()
    receiverid: number;

    @IsInt()
    chatId: number;

    @IsString()
    message: string;


    @IsString()
    time: string;


  }
  
export class privateDirectMessageDto {
    @IsInt()
    senderid: number;

    @IsString()
    receiverid: string;

    @IsString()
    message: string;


  }
  

