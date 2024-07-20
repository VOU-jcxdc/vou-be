import { BaseRepository, Account } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AccountRepository extends BaseRepository<Account> {
  constructor(@InjectRepository(Account) repository: Repository<Account>) {
    super(repository);
  }
}
