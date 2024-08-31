import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountItem } from "@database";
import { AccountItemRepository } from "./account-item.repository";
@Module({
  imports: [TypeOrmModule.forFeature([AccountItem])],
  providers: [AccountItemRepository],
  exports: [AccountItemRepository],
})
export class AccountItemRepositoryModule {}
