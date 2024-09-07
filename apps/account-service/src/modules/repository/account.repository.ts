import { BaseRepository, Account } from "@database";
import { Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AccountRoleEnum, AccountStatusEnum, CreateAccountDto, IAccount } from "@types";
import { isNil } from "lodash";
import { Like, ILike, Not, Repository } from "typeorm";

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

    return this.save(data.role !== AccountRoleEnum.BRAND ? { ...data, status: AccountStatusEnum.ACTIVE } : data);
  }

  async getExistedAccount(phone: string) {
    const existedAccount = await this.findOne({ where: { phone }, select: ["id", "password", "role"] });
    if (!existedAccount) {
      throw new NotFoundException("Account not existed");
    }
    return existedAccount;
  }

  async getAllAccounts(
    offset: number,
    limit: number,
    role: AccountRoleEnum = undefined,
    keySearch: string = undefined,
    currentUser: string = undefined
  ) {
    // Construct the base query condition
    const whereCondition: any = isNil(role) ? {} : { role };
    const excludeUserCondition: any = isNil(currentUser) ? {} : { id: Not(currentUser) };

    // Add keySearch filter for email, phone, or username if provided
    const searchConditions = isNil(keySearch)
      ? [{}, {}, {}]
      : [{ email: ILike(`%${keySearch}%`) }, { phone: ILike(`%${keySearch}%`) }, { username: ILike(`%${keySearch}%`) }];

    const [accounts, total] = await this.repository.findAndCount({
      where: searchConditions.map((condition: any) => {
        return {
          ...whereCondition,
          ...excludeUserCondition,
          ...condition,
        };
      }),
      skip: offset,
      take: limit,
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        createdOn: true,
        status: true,
      },
    });
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
