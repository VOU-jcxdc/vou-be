import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Gift } from "@database";
import { GiftRepository } from "./gift.repository";
@Module({
  imports: [TypeOrmModule.forFeature([Gift])],
  providers: [GiftRepository],
  exports: [GiftRepository],
})
export class GiftRepositoryModule {}
