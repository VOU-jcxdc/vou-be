import { MongoDatabaseModule, PostgreDatabaseModule } from "@database";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CombineItemModule } from "../combine-item/combine_item.module";
import { ItemModule } from "../item/item.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostgreDatabaseModule,
    MongoDatabaseModule,
    CombineItemModule,
    ItemModule,
  ],
})
export class AppModule {}
