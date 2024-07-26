import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "../user/user.module";
import { BucketModule } from "../bucket/bucket.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, BucketModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
