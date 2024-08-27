import { Module } from "@nestjs/common";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";
import { CombineItemModelModule } from "../model/combine_item-model.module";
import { CombineItemHelper } from "../combine-item/combine_item.helper";
import { ConfigModule } from "@nestjs/config";
import { ItemRepositoryModule } from "../repository/item-repository.module";

@Module({
  imports: [ItemRepositoryModule, CombineItemModelModule, ConfigModule],
  controllers: [ItemController],
  providers: [ItemService, CombineItemHelper],
})
export class ItemModule {}
