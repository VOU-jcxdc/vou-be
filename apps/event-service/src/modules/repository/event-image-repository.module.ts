import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventImage } from "@database";
import { EventImageRepository } from "./event-image.repository";

@Module({
  imports: [TypeOrmModule.forFeature([EventImage])],
  providers: [EventImageRepository],
  exports: [EventImageRepository],
})
export class EventImageRepositoryModule {}
