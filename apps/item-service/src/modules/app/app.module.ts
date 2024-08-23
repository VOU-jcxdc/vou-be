import { MongoDatabaseModule, PostgreDatabaseModule } from "@database";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PostgreDatabaseModule, MongoDatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
