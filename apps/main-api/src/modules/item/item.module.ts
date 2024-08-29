import { Module } from "@nestjs/common";
import { CombineItemController } from "./combine_item.controller";
import { CombineItemService } from "./combine_item.service";
import { ClientProxyModule } from "@shared-modules";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";

@Module({
  imports: [ClientProxyModule],
  controllers: [CombineItemController, ItemController],
  providers: [CombineItemService, ItemService],
})
export class ItemModule {}
