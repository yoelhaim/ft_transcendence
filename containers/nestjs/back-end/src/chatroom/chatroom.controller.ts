import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatRoomDto, UpdateRoomDto } from './chatroom.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import * as fs from 'fs';
import { PermissionGuard } from 'src/connect/strategy/protectUserGard';

@Controller('room')
@UseGuards(AuthGuard('authGuard'))
export class ChatContoller {
  constructor(private readonly chatRooms: ChatroomService) {}
  @UseGuards(PermissionGuard)
  @Post('create')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './upload',
        filename(req, file, callback) {
          const name = file.originalname.split('.')[0];
          const ext = file.originalname.split('.')[1];
          const fullname = name + Date.now() + '.' + ext;
          callback(null, fullname);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i))
          return cb(null, false);
        else cb(null, true);
      },
    }),
  )
  async createRoom(
    @UploadedFile()
    file: Express.Multer.File,
    @Body(ValidationPipe) body: ChatRoomDto,@Req() {user} : Request,
  ) {
    try {
      let fileBuffer;
      !file
        ? (fileBuffer = fs.readFileSync('./upload/default.png'))
        : (fileBuffer = fs.readFileSync(file.path));

      body.image = await this.chatRooms.uploadImage(fileBuffer);
      if (file) fs.unlinkSync(file.path);
      body.ownerId = user['id'];
      return await this.chatRooms.createRoom(body);
    } catch (error) {
      throw error;
    }
  }

  @Patch('update/:roomId')
  @UseGuards(PermissionGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './upload',
        filename(req, file, callback) {
          const name = file.originalname.split('.')[0];
          const ext = file.originalname.split('.')[1];
          const fullname = name + Date.now() + '.' + ext;
          callback(null, fullname);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i))
          return cb(null, false);
        else cb(null, true);
      },
    }),
  )
  async UpdateRoom(
    @UploadedFile()
    file: Express.Multer.File,
    @Body(ValidationPipe) body: UpdateRoomDto,
    @Param('roomId') roomId: string,
    @Req() req: Request,
  ) {
    try {
      const userId = parseInt(req.user['id']);
      const id = parseInt(roomId);
      let fileBuffer;

      if (file) {
        fileBuffer = fs.readFileSync(file.path);
        body.image = await this.chatRooms.uploadImage(fileBuffer);
        fs.unlinkSync(file.path);
      }

      return await this.chatRooms.updateroom(body, id, userId);
    } catch (error) {
       throw error;
    }
  }
  //   @Get('avatar/:pathname')
  //   async getPathName(@Param('pathname') pathname: string, @Res() res: Response) {
  //     res.sendFile(pathname, { root: './upload' });
  //   }

  @Get('lastadd/:userId')
  @UseGuards(PermissionGuard)
  async getAllRomms(@Param('userId', new ParseIntPipe()) userId: number) {
    try {
      return await this.chatRooms.findLatestRoom(userId);
    } catch (error) {
       throw error;
    }
  }
  /* get public and protected rooms */
  @Get('rooms/:userId/:page/:search?')
  @UseGuards(PermissionGuard)
  async getPublicRooms(
    @Param('userId') userId: number,
    @Param('page') page: number,
    @Param('search') search: string,
    @Req() req?: Request,
  ) {
    try {
        userId = parseInt(req.user['id']); 
        return this.chatRooms.findPublicProtectedRooms(userId, page, search);
    } catch (error) {
         throw error;
    }
  }

  @Delete('delete/:userId/:roomId')
  async deleteRoom(
    @Param('userId', new ParseIntPipe()) userId: number,
    @Param('roomId', new ParseIntPipe()) roomId: number,
    @Req() {user}: Request,
  ) {
    try {
        userId = user['id'];  

        return await this.chatRooms.deleteRoom(userId, roomId);
    } catch (error) {
         throw error;
    }
  }

  @Post('exits')
  @UseGuards(PermissionGuard)
  async checkIfexitsRoom(
    @Body('name') name: string,
    @Body('userId', new ParseIntPipe()) userId: number,
  ) {
   try {
    userId;
    return await this.chatRooms.checkIfexitsRoom(name);
   } catch (error) {
     throw error;
   }
  }

  @Get('usersroom/:roomId')
  @UseGuards(PermissionGuard)
  async getUserByroom(
    @Param('roomId', new ParseIntPipe()) roomId: number,
    @Req() req: Request,
  ) {
   try {
    const idHeader = parseInt(req.user['id']);
    return await this.chatRooms.getusersByroom(roomId, idHeader);
   } catch (error) {
     throw error;
    
   }
  }
  @Get('blockroom/:roomId')
  @UseGuards(PermissionGuard)
  async getBlockUsersRoom(@Param('roomId', new ParseIntPipe()) roomId: number) {
    return await this.chatRooms.getblockedUser(roomId);
  }
}
