import { Module } from '@nestjs/common';
import { connectController } from './connectController';
import { connectService } from './connectService';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from './auth/42.strategy';
import { JwtModule } from '@nestjs/jwt';
import { userController } from './userController';
import { jwtstrategy } from './strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  controllers: [connectController, userController],
  providers: [connectService, FortyTwoStrategy, jwtstrategy, ConfigService],
})
export class connectmodule {}
