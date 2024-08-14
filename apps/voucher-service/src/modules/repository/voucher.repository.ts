import { BaseRepository, Voucher } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VoucherDetailDto } from "@types";
import { Repository } from "typeorm";

@Injectable()
export class VoucherRepository extends BaseRepository<Voucher> {
  constructor(@InjectRepository(Voucher) repository: Repository<Voucher>) {
    super(repository);
  }

  async saveManyVouchers(vouchers: VoucherDetailDto[]) {
    try {
      const createdVouchers = vouchers.map(async (voucher) => {
        const { quantity, ...voucherData } = voucher;
        const savedVoucher = await this.save(voucherData);
        return {
          ...savedVoucher,
          quantity,
        };
      });

      if (createdVouchers && createdVouchers.length > 0) {
        const results = await Promise.all(createdVouchers);
        return results;
      }
      return [];
    } catch (error) {
      throw error;
    }
  }
}
