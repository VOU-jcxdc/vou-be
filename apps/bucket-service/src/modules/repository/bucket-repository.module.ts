import { Bucket } from "@database";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BucketRepository } from "./bucket.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Bucket])],
  providers: [BucketRepository],
  exports: [BucketRepository],
})
export class BucketRepositoryModule {}
