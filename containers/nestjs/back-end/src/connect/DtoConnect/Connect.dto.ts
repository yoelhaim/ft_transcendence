import { IsNotEmpty, IsString, IsEmail, IsNumber } from "class-validator";

export class ConnectDto{
    @IsString()
    @IsNotEmpty()
    firstName: string;
    @IsString()
    @IsNotEmpty()
    lastName: string;
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
    bio: string;
    cover: string;
    @IsString()
    @IsNotEmpty()
    avatar: string;
    UserName: string;
    level: Float32Array; 




}