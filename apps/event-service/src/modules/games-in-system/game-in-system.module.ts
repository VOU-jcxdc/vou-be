import { Module } from "@nestjs/common";
import { GameInSystemRepositoryModule } from "../repository/game-in-system-repository.module";
import { GameInSystemController } from "./game-in-system.controller";
import { GameInSystemService } from "./game-in-system.service";

@Module({
  imports: [GameInSystemRepositoryModule],
  controllers: [GameInSystemController],
  providers: [GameInSystemService],
})
export class GameInSystemModule {}
