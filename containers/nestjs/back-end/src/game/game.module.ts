import { Module } from '@nestjs/common';
import { GameGateway } from './gateway/game/game.gateway';
import { GameService } from './services/game/game.service';
import { GameEngineService } from './services/game/game.engine.service';

@Module({
  providers: [GameGateway, GameService, GameEngineService]
})
export class GameModule {
    
}
