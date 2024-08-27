import { MongoDatabaseModule, PostgreDatabaseModule } from "@database";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CombineItemModule } from "../combine-item/combine_item.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PostgreDatabaseModule, MongoDatabaseModule, CombineItemModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
