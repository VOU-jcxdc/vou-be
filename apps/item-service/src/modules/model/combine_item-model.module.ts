import { CombineItems, CombineItemsSchema, MongoDatabaseModule } from "@database";
import { Module } from "@nestjs/common";
import { CombineItemModel } from "./combine_item.model";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CombineItems.name,
        schema: CombineItemsSchema,
      },
    ]),
    MongoDatabaseModule,
  ],
  providers: [CombineItemModel],
  exports: [CombineItemModel],
})
export class CombineItemModelModule {}
