import { Module } from "@nestjs/common";
import { RecipeController } from "./recipe.controller";
import { RecipeService } from "./recipe.service";
import { ClientProxyModule } from "@shared-modules";
import { ItemController } from "./item.controller";
import { GiftController } from "./gift.controller";
import { GiftService } from "./gift.service";
import { ItemService } from "./item.service";
import { CombineItemController } from "./combine_item.controller";
import { CombineItemService } from "./combine_item.service";
import { RecipeHelper } from "./recipe.helper";

@Module({
  imports: [ClientProxyModule],
  controllers: [RecipeController, CombineItemController, ItemController, GiftController],
  providers: [RecipeService, ItemService, GiftService, CombineItemService, RecipeHelper],
})
export class ItemModule {}
