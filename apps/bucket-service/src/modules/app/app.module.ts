import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { S3Module } from "nestjs-s3";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PostgreDatabaseModule } from "@database";
import { BucketRepositoryModule } from "../repository/bucket-repository.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    S3Module.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          credentials: {
            accessKeyId: configService.get("BUCKET_ACCESS_KEY_ID"),
            secretAccessKey: configService.get("BUCKET_SECRET_ACCESS_KEY"),
          },
          region: "auto",
          endpoint: configService.get("BUCKET_ENDPOINT"),
          signatureVersion: "v4",
        },
      }),
    }),
    PostgreDatabaseModule,
    BucketRepositoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
