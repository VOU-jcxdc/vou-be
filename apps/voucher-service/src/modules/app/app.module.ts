import { Module } from "@nestjs/common";

import { PostgreDatabaseModule } from "@database";
import { ConfigModule } from "@nestjs/config";
import { VoucherRepositoryModule } from "../repository/voucher-repository.module";
import { VoucherModule } from "../voucher/voucher.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PostgreDatabaseModule, VoucherRepositoryModule, VoucherModule],
})
export class AppModule {}
