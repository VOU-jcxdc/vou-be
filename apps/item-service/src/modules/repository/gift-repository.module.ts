import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Item, AccountItem, Gift } from "@database";
import { GiftRepository } from "./gift.repository";
@Module({
  imports: [TypeOrmModule.forFeature([Item, AccountItem, Gift])],
  providers: [GiftRepository],
  exports: [GiftRepository],
})
export class GiftRepositoryModule {}
