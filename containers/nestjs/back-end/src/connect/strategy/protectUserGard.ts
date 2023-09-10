import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // const requiredPermissions = 'hi';

    // if (!requiredPermissions) {
    //   return true;
    // }

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const user = request?.user?.id;
    if (!user) return false;
    const idCookie = request.cookies.userId;
    const res = parseInt(user) === parseInt(idCookie) ? true : false;
    if (!res) {
      response.clearCookie('token');
      response.clearCookie('userId');
    }
    return res;
  }
}
