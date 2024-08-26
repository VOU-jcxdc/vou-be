import { Module } from "@nestjs/common";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";
import { CombineItemModelModule } from "../model/combine_item-model.module";
import { ItemHelper } from "./item.helper";

@Module({
  imports: [CombineItemModelModule],
  controllers: [ItemController],
  providers: [ItemService, ItemHelper],
})
export class ItemModule {}
