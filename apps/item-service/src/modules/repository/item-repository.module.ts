import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Item, AccountItem, Gift } from "@database";
import { ItemRepository } from "./item.repository";
@Module({
  imports: [TypeOrmModule.forFeature([Item, AccountItem, Gift])],
  providers: [ItemRepository],
  exports: [ItemRepository],
})
export class ItemRepositoryModule {}
