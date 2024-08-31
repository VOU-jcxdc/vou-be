import { Game } from "@database";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameInSystemRepository } from "./game-in-system.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  providers: [GameInSystemRepository],
  exports: [GameInSystemRepository],
})
export class GameInSystemRepositoryModule {}
