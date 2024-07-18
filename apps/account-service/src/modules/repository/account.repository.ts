import { BaseRepository, Account } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IAccount } from "@types";
import { Repository } from "typeorm";

@Injectable()
export class AccountRepository extends BaseRepository<IAccount> {
  constructor(@InjectRepository(Account) repository: Repository<Account>) {
    super(repository);
  }
}
