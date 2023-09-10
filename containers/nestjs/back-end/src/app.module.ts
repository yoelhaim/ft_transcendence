// import { AppController } from './app.controller';
import { connectmodule } from './connect/connectModule';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from './prisma/prisma.module';
import { GameController } from './game/controllers/game/game.controller';
import { GameService } from './game/services/game/game.service';
import { GameModule } from './game/game.module';
import { SearchController } from './search/controller/search/search.controller';
import { SearchService } from './search/services/search/search.service';
import { ProfileController } from './profile/controller/profile/profile.controller';
import { ProfileService } from './profile/services/profile/profile.service';
import { PrismaService } from './prisma/prisma.service';
import { ChatroomModule } from './chatroom/chatroom.module';
import { MessageRoomModule } from './messageroom/message.module';

import { NotificationsGateway } from './notification/gateway/notifications/notifications.gateway';

import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { NotificationModule } from './notification/notification.module';
import { NotificationService } from './notification/services/notification/notification.service';
import { NotificationController } from './notification/controller/notification/notification.controller';

import { privateChatModule } from './privatechat/privateChat.module';

//youssama
import { BlockService } from './block/block.service';
import { BlockController } from './block/block.controller';
import { BlockModule } from './block/block.module';
import { BlocklistModule } from './blocklist/blocklist.module';
import { UpdateController } from './update/update.controller';
import { UpdateService } from './update/update.service';
import { UpdateModule } from './update/update.module';
import { ProfileControllerYouss } from './profile/profileyouss.controller';
import { ProfileServiceYouss } from './profile/profileyouss.service';
import { ChatroomService } from './chatroom/chatroom.service';
import { joinRoomService } from './chatroom/joinroom/joinroom.service';
import { JoinRoomModule } from './chatroom/joinroom/joinroom.module';
import { JoinRoomController } from './chatroom/joinroom/joinroom.controller';
import { GoogleService } from './connect/google/google.service';
import { GoogleController } from './connect/google/google.controller';
import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard/leaderboard.service';
import { LeaderboardController } from './leaderboard/leaderboard.controller';
// import { JoinRoomModule } from './chatroom/joinroom/joinroom.module';
import { ThemesService } from './themes/service/themes/themes.service';
import { ThemesController } from './themes/controller/themes/themes.controller';




@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register({
      dest: './upload',
    }),
    NotificationModule,
    MessageRoomModule,
    ChatroomModule,
    connectmodule,
    PrismaModule,
    PassportModule.register({ session: true }),
    GameModule,
    PrismaModule,
    privateChatModule,
    UpdateModule,
    BlockModule,
    BlocklistModule,
    JoinRoomModule,
  ],
  // controllers: [AppController],

  providers: [
    GameService,
    SearchService,
    ProfileService,
    NotificationService,
    NotificationsGateway,
    PrismaService,
    UpdateService,
    BlockService,
    ProfileServiceYouss,
    ChatroomService,
    joinRoomService,
    GoogleService,
    LeaderboardService,
    ThemesService,
  ],

  controllers: [
    GameController,
    SearchController,
    ProfileController,
    NotificationController,
    UpdateController,
    BlockController,
    ProfileControllerYouss,
    JoinRoomController,
    GoogleController,
    LeaderboardController,
    ThemesController,
  ],
})
export class AppModule {}
