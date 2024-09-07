import { Module } from "@nestjs/common";
import { RecipeController } from "./recipe.controller";
import { RecipeService } from "./recipe.service";
import { CombineItemModelModule } from "../model/combine_item-model.module";
import { RecipeHelper } from "./recipe.helper";
import { ItemRepositoryModule } from "../repository/item-repository.module";

@Module({
  imports: [CombineItemModelModule, ItemRepositoryModule],
  controllers: [RecipeController],
  providers: [RecipeService, RecipeHelper],
})
export class RecipeModule {}
