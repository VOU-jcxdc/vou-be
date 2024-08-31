import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventImage } from "@database";
import { EventImageRepository } from "./event-image.repository";
import { GameInSystemRepositoryModule } from "./game-in-system-repository.module";

@Module({
  imports: [TypeOrmModule.forFeature([EventImage]), GameInSystemRepositoryModule],
  providers: [EventImageRepository],
  exports: [EventImageRepository],
})
export class EventImageRepositoryModule {}
