import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import * as schemas from "./schemas";
const rawSchema = Object.keys(schemas);
const schemaArray = [];

for (let i = 0; i < rawSchema.length; ++i)
  if (rawSchema[i].includes("Schema")) {
    const name = rawSchema[i].replace("Schema", "");
    schemaArray.push({
      name,
      schema: schemas[rawSchema[i] as keyof typeof schemas],
    });
  }

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get("MONGO_URI"),
        dbName: configService.get("MONGO_DB_NAME"),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature(schemaArray),
  ],
  exports: [MongooseModule],
})
export class MongoDatabaseModule {}
