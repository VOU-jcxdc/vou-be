import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { AccountRepository } from "../repository/account.repository";
import { CreateAccountDto } from "@types";
import { AccountHelper } from "./account.helper";
import { RpcException } from "@nestjs/microservices";
@Injectable()
export class AccountService {
  private readonly logger: Logger;
  constructor(private readonly accountRepository: AccountRepository, private readonly accountHelper: AccountHelper) {
    this.logger = new Logger(AccountService.name);
  }

  async createAccount(value: CreateAccountDto) {
    try {
      const { password, data, ...rest } = value;
      const hashedPassword = await this.accountHelper.hashPassword(password);
      const newAccount = await this.accountRepository.createAccount({
        ...rest,
        password: hashedPassword,
      });
      await this.accountHelper.createInfoData(value.role, value.data, newAccount.id);
      return this.accountHelper.buildCreateAccountResponse(newAccount);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async verifyAccount(phone: string, password: string) {
    try {
      const account = await this.accountRepository.getExistedAccount(phone);
      const isPasswordValid = await this.accountHelper.verifyPassword(password, account.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException("Password is incorrect");
      }
      return this.accountHelper.buildLoginResponse(account);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
