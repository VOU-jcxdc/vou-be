import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "../user/user.module";
import { BucketModule } from "../bucket/bucket.module";
import { AuthModule } from "../auth/auth.module";
import { EventModule } from "../event/event.module";
import { VoucherModule } from "../voucher/voucher.module";
import { ItemModule } from "../item/item.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    BucketModule,
    AuthModule,
    EventModule,
    VoucherModule,
    ItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
