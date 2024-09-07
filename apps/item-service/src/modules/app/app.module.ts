import { PostgreDatabaseModule, MongoDatabaseModule } from "@database";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RecipeModule } from "../recipe/recipe.module";
import { ItemModule } from "../item/item.module";
import { GiftModule } from "../gift/gift.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostgreDatabaseModule,
    MongoDatabaseModule,
    RecipeModule,
    GiftModule,
    ItemModule,
  ],
})
export class AppModule {}
