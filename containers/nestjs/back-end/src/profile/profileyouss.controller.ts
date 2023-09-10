import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Put,
  Req,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileServiceYouss } from './profileyouss.service';
import { AuthGuard } from '@nestjs/passport';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { PermissionGuard } from 'src/connect/strategy/protectUserGard';

@Controller('profile')
@UseGuards(AuthGuard('authGuard'))
export class ProfileControllerYouss {
  constructor(
    private readonly updateService: ProfileServiceYouss,
    private readonly chatRooms: ChatroomService,
  ) {}
  @Get(':senderId/:receiverId')
  @UseGuards(PermissionGuard)
  getFriendStatus(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
  ): any {
    return this.updateService.getFriendStatus(+senderId, receiverId);
  }

  @Post('accept/:senderId')
  async acceptFriend(
    @Param('senderId') senderId: string,
    @Req() { user }: Request,
  ) {
    return await this.updateService.acceptFriend(senderId, user['id']);
  }
  @Post('reject/:senderId')
  async rejectFriend(
    @Param('senderId') senderId: string,
    @Req() { user }: Request,
  ) {
    return await this.updateService.rejectFriend(senderId, user['id']);
  }

  @Put(':receiverId')
  @UseGuards(PermissionGuard)
  async addFriend(
    @Param('receiverId') receiverId: string,
    @Req() req: Request,
  ) {
    const userIdHeader = parseInt(req.cookies.userId as string);
    return this.updateService.addFriend(userIdHeader, receiverId);
  }

  //   update image
  @Patch('updateProfile')
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
  async updateProfile(
    @UploadedFile()
    file: Express.Multer.File,
    @Body() body: any,
    @Req() req: Request,
  ) {
    try {
      const userIdHeader = parseInt(req.cookies.userId as string);
      if (!file) throw new ForbiddenException('error upload avatar');
      if (!file.path) throw new ForbiddenException('error upload avatar');
      const fileBuffer = fs.readFileSync(file.path);

      body.image = await this.chatRooms.uploadImage(fileBuffer);
      if (file) fs.unlinkSync(file.path);
      return await this.updateService.updateProfilePicture(
        body.image,
        body.type,
        userIdHeader,
      );
    } catch (error) {
      throw error;
    }
  }
}
