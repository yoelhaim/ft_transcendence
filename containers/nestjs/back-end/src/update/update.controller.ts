import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UpdateService } from './update.service';
import e, { Response } from 'express';
import { PermissionGuard } from 'src/connect/strategy/protectUserGard';
import { AuthGuard } from '@nestjs/passport';


@Controller('update')
@UseGuards(AuthGuard('authGuard'))
export class UpdateController {
  constructor(private readonly updateService: UpdateService) {}
  @Get(':id')
  @UseGuards(PermissionGuard)
  getOneUser(@Param('id') id: string): any {
    return this.updateService
      .getOneUser(+id)
      .then((data) => {
        return data;
      })
      .catch((err) => {
       throw err;
      });
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  async update(
    @Param('id') id: number,
    @Query('username') username: string,
    @Query('firstname') firstname: string,
    @Query('lastname') lastname: string,
    @Query('bio') bio: string,
    @Query('avatar') avatar: string,
    @Query('cover') cover: string,
    @Res() res: Response,
  ) {
    res.clearCookie('firstTime');
    try {
      const data = await this.updateService.updateUser(
        +id,
        username,
        firstname,
        lastname,
        bio,
        avatar,
        cover,
      );
      return res.send(data ? ' update' : 'no');
    } catch (error) {
      throw error;
    }
  }
}
