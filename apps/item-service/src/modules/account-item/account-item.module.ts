import { Module } from "@nestjs/common";
import { AccountItemService } from "./account-item.service";
import { ConfigModule } from "@nestjs/config";
import { ItemService } from "../item/item.service";
import { AccountItemRepositoryModule } from "../repository/account-item-repository.module";
// import { ItemController } from "./item.controller";

@Module({
  imports: [AccountItemRepositoryModule, ItemService, ConfigModule],
  //   controllers: [ItemController],
  providers: [AccountItemService],
})
export class AccountItemModule {}
