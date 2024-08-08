import { AccountVoucher, BaseRepository } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AccountVoucherRepository extends BaseRepository<AccountVoucher> {
  constructor(@InjectRepository(AccountVoucher) repository: Repository<AccountVoucher>) {
    super(repository);
  }
}
