import { Module } from "@nestjs/common";
import { VoucherController } from "./voucher.controller";
import { VoucherService } from "./voucher.service";
import { VoucherRepositoryModule } from "../repository/voucher-repository.module";

@Module({
  imports: [VoucherRepositoryModule],
  controllers: [VoucherController],
  providers: [VoucherService],
})
export class VoucherModule {}
