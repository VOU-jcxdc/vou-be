import { AccountVoucher, EventVoucher, Voucher } from "@database";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VoucherRepository } from "./voucher.repository";
import { EventVoucherRepository } from "./event-voucher.repository";
import { AccountVoucherRepository } from "./account-voucher.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Voucher, EventVoucher, AccountVoucher])],
  providers: [VoucherRepository, EventVoucherRepository, AccountVoucherRepository],
  exports: [VoucherRepository, EventVoucherRepository, AccountVoucherRepository],
})
export class VoucherRepositoryModule {}
