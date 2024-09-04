import { Module } from "@nestjs/common";
import { RedisModule } from "@shared-modules";
import { QuizgameConfigController } from "./config.controller";
import { QuizgameConfigService } from "./config.service";

@Module({
  imports: [RedisModule],
  controllers: [QuizgameConfigController],
  providers: [QuizgameConfigService],
})
export class QuizgameConfigModule {}
