import { Module } from "@nestjs/common";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";
import { CombineItemModelModule } from "../model/combine_item-model.module";
import { CombineItemHelper } from "../combine-item/combine_item.helper";
import { ConfigModule } from "@nestjs/config";
import { ItemRepositoryModule } from "../repository/item-repository.module";
import { AccountItemRepositoryModule } from "../repository/account-item-repository.module";
import { AccountItemHelper } from "./account-item.helper";
import { ItemHelper } from "./item.helper";

@Module({
  imports: [ItemRepositoryModule, CombineItemModelModule, AccountItemRepositoryModule, ConfigModule],
  controllers: [ItemController],
  providers: [ItemService, CombineItemHelper, AccountItemHelper, ItemHelper],
  exports: [ItemService],
})
export class ItemModule {}
