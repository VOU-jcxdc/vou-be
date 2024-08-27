import { BaseRepository, AccountItem } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AccountItemRepository extends BaseRepository<AccountItem> {
  constructor(@InjectRepository(AccountItem) repository: Repository<AccountItem>) {
    super(repository);
  }
}
