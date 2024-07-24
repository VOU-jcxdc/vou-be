import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientOptions, Transport } from "@nestjs/microservices";
import { BucketController } from "./bucket.controller";
import { BucketService } from "./bucket.service";

@Module({
  imports: [ConfigModule],
  controllers: [BucketController],
  providers: [
    {
      provide: "BUCKET_SERVICE",
      useFactory: (configService: ConfigService): ClientOptions => ({
        transport: Transport.TCP,
        options: {
          host: configService.get("BUCKET_SERVICE_HOST"),
          port: configService.get("BUCKET_SERVICE_PORT"),
        },
      }),
      inject: [ConfigService],
    },
    BucketService,
  ],
})
export class BucketModule {}
