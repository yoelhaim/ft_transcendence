import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';



@Injectable()
export class UpdateService {
  constructor(private readonly prisma: PrismaService) {}

  async getOneUser(id: number): Promise<any> {
    return await this.prisma.user
      .findUnique({
        where: {
          id: id,
        },
        select: {
          firstName: true,
          lastName: true,
          UserName: true,
          id: true,
          avatar: true,
          cover: true,
          bio: true,
          email: true,
        },
      })
      .then((data) => {
        return data;
      })
      .catch(() => {
        return {};
      });
  }

  async updateUser(
    id: number,
    username: string,
    firstname: string,
    lastname: string,
    bio: string,
    avatar: string,
    cover: string,
  ): Promise<any> {
    try {
      const checkUniqueName = await this.prisma.user.findFirst({
        where: {
          NOT: { id },
          UserName: username,
        },
      });

      const Symbols = /[^\w\s\-_]/g;
      if (username.match(Symbols))
        throw new ForbiddenException('Error username doasn`t support symbols');
     
      if (checkUniqueName)
        throw new ForbiddenException('username already exists');

       

        const checkvalue = [firstname, lastname, username]
        if (checkvalue.some((e) => e.length < 3))
            throw new ForbiddenException('length of value is low');
        if (checkvalue.some((e) => e.length > 20))
            throw new ForbiddenException('length of value is high');
      const up = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          firstName: firstname.trim(),
          lastName: lastname.trim(),
          UserName: username.trim(),
          avatar,
          cover,
          bio,
          firstTime: false,
        },
      });
      if (!up) throw new NotFoundException('not update');
      return up;
    } catch (error) {
      throw error;
    }
  }
}

export enum friendStatus {
  pending = 'pending',
  accepted = 'accepted',
  rejected = 'rejected',
}
