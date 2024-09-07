import { Module } from "@nestjs/common";
import { RecipeController } from "./recipe.controller";
import { RecipeService } from "./recipe.service";
import { ClientProxyModule } from "@shared-modules";
import { ItemController } from "./item.controller";
import { GiftController } from "./gift.controller";
import { GiftService } from "./gift.service";
import { ItemService } from "./item.service";

@Module({
  imports: [ClientProxyModule],
  controllers: [RecipeController, ItemController, GiftController],
  providers: [RecipeService, ItemService, GiftService],
})
export class ItemModule {}
