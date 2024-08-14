import { BaseRepository, EventVoucher } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class EventVoucherRepository extends BaseRepository<EventVoucher> {
  constructor(@InjectRepository(EventVoucher) repository: Repository<EventVoucher>) {
    super(repository);
  }

  async deleteVouchersInEvent(eventId: string, voucherIds: string[]) {
    try {
      return this.repository
        .createQueryBuilder("events_vouchers")
        .delete()
        .where("events_vouchers.event_id = :eventId", { eventId })
        .andWhere("events_vouchers.voucher_id IN (:...voucherIds)", { voucherIds })
        .execute();
    } catch (error) {
      throw error;
    }
  }
}
