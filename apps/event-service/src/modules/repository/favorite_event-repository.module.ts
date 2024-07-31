import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FavoriteEvent } from "@database";
import { FavoriteEventRepository } from "./favorite_event.repository.module";

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteEvent])],
  providers: [FavoriteEventRepository],
  exports: [FavoriteEventRepository],
})
export class FavoriteEventRepositoryModule {}
