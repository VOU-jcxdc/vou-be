import { Module } from "@nestjs/common";
import { CombineItemController } from "./combine_item.controller";
import { CombineItemService } from "./combine_item.service";
import { ClientProxyModule } from "@shared-modules";
import { ItemController } from "./item.controller";
import { GiftController } from "./gift.controller";
import { GiftService } from "./gift.service";
import { ItemService } from "./item.service";

@Module({
  imports: [ClientProxyModule],
  controllers: [CombineItemController, ItemController, GiftController],
  providers: [CombineItemService, ItemService, GiftService],
})
export class ItemModule {}
