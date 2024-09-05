import { Module } from "@nestjs/common";
import { GameConfigService } from "./config.service";
import { RedisModule } from "@shared-modules";

@Module({
  imports: [RedisModule],
  providers: [GameConfigService],
  exports: [GameConfigService],
})
export class GameConfigModule {}
