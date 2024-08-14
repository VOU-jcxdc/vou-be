import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BucketController } from "./bucket.controller";
import { BucketService } from "./bucket.service";
import { ClientProxyModule } from "@shared-modules";

@Module({
  imports: [ConfigModule, ClientProxyModule],
  controllers: [BucketController],
  providers: [BucketService],
})
export class BucketModule {}
