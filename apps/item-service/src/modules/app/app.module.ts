import { PostgreDatabaseModule } from "@database";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ItemModule } from "../item/item.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PostgreDatabaseModule, MongoDatabaseModule, ItemModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
