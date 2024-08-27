import { Module } from "@nestjs/common";
import { CombineItemController } from "./combine_item.controller";
import { CombineItemService } from "./combine_item.service";
import { CombineItemModelModule } from "../model/combine_item-model.module";
import { CombineItemHelper } from "./combine_item.helper";

@Module({
  imports: [CombineItemModelModule],
  controllers: [CombineItemController],
  providers: [CombineItemService, CombineItemHelper],
})
export class CombineItemModule {}
