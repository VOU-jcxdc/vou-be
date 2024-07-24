import { BaseRepository, Account } from "@database";
import { Injectable, NotAcceptableException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AccountRoleEnum, CreateAccountDto, IAccount } from "@types";
import { Repository } from "typeorm";

@Injectable()
export class AccountRepository extends BaseRepository<Account> {
  private readonly _repository: Repository<Account> = null;
  constructor(@InjectRepository(Account) repository: Repository<Account>) {
    super(repository);
    this._repository = repository;
  }

  async createAccount(data: Omit<CreateAccountDto, "data">): Promise<Account> {
    const { phone } = data;
    const existedAccount = await this.findOne({ where: { phone } });
    if (existedAccount) {
      throw new NotAcceptableException("Account existed");
    }

    return this._repository.save(data);
  }
}
