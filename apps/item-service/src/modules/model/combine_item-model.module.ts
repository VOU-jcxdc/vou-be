import { MongoDatabaseModule } from "@database";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CombineItemModel } from "./combine_item.model";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MongoDatabaseModule],
  providers: [CombineItemModel],
  exports: [CombineItemModel],
})
export class CombineItemModelModule {}
