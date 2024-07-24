import { BaseRepository, Account } from "@database";
import { Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAccountDto, IAccount } from "@types";
import { Repository } from "typeorm";

@Injectable()
export class AccountRepository extends BaseRepository<Account> {
  constructor(@InjectRepository(Account) repository: Repository<Account>) {
    super(repository);
  }

  async createAccount(data: Omit<CreateAccountDto, "data">): Promise<IAccount> {
    const { phone } = data;
    const existedAccount = await this.findOne({ where: { phone } });
    if (existedAccount) {
      throw new NotAcceptableException("Account existed");
    }

    return this.create(data);
  }

  async getExistedAccount(phone: string) {
    const existedAccount = await this.findOne({ where: { phone } });
    if (!existedAccount) {
      throw new NotFoundException("Account not existed");
    }
    return existedAccount;
  }
}
