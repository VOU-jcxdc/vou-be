import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import * as dbEntites from "./entities";
const entities = (Object.keys(dbEntites) as Array<keyof typeof dbEntites>).map((key) => dbEntites[key]);

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("POSTGRE_HOST"),
        port: configService.get("POSTGRE_PORT"),
        username: configService.get("POSTGRE_USER"),
        password: configService.get("POSTGRE_PASSWORD"),
        database: configService.get("POSTGRE_DB"),
        entities,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class PostgreDatabaseModule {}
