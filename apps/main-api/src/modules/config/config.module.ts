import { Module } from "@nestjs/common";
import { RedisModule } from "@shared-modules";
import { GameConfigController } from "./config.controller";
import { GameConfigService } from "./config.service";

@Module({
  imports: [RedisModule],
  controllers: [GameConfigController],
  providers: [GameConfigService],
})
export class GameConfigModule {}
