import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Item, AccountItem, Gift } from "@database";
import { AccountItemRepository } from "./account-item.repository";
@Module({
  imports: [TypeOrmModule.forFeature([Item, AccountItem, Gift])],
  providers: [AccountItemRepository],
  exports: [AccountItemRepository],
})
export class AccountItemRepositoryModule {}
