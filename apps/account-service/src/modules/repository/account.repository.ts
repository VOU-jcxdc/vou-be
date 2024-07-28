import { BaseRepository, Account } from "@database";
import { Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AccountRoleEnum, CreateAccountDto, IAccount } from "@types";
import { isNil } from "lodash";
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

    return this.save(data);
  }

  async getExistedAccount(phone: string) {
    const existedAccount = await this.findOne({ where: { phone }, select: ["id", "password", "role"] });
    if (!existedAccount) {
      throw new NotFoundException("Account not existed");
    }
    return existedAccount;
  }

  async getAllAccounts(offset: number, limit: number, role: AccountRoleEnum = undefined) {
    const [accounts, total] = await Promise.all([
      this.repository.find({
        where: isNil(role) ? {} : { role },
        skip: offset,
        take: limit,
        select: {
          id: true,
          username: true,
          phone: true,
          role: true,
          createdOn: true,
          status: true,
        },
      }),
      this.repository.count(),
    ]);

    return { accounts, total, offset, limit };
  }

  async getAccountInfoWithRole(id: string, role: AccountRoleEnum) {
    return this.findOne({
      where: { id },
      relations:
        role === AccountRoleEnum.PLAYER
          ? {
              playerInfo: true,
            }
          : {
              brandInfo: true,
            },
    });
  }

  async getAccountInfo(id: string) {
    return this.findOne({
      where: { id },
      relations: {
        playerInfo: true,
        brandInfo: true,
      },
    });
  }
}
