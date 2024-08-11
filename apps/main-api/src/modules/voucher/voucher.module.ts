import { Module } from "@nestjs/common";
import { VoucherController } from "./voucher.controller";
import { VoucherService } from "./voucher.service";
import { ClientProxyModule } from "@shared-modules";

@Module({
  imports: [ClientProxyModule],
  controllers: [VoucherController],
  providers: [VoucherService],
})
export class VoucherModule {}
