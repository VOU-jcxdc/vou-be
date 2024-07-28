import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { AccountRepository } from "../repository/account.repository";
import { AccountRoleEnum, CreateAccountDto, UdpateAccountDto, UpdateAccountByAdminDto } from "@types";
import { AccountHelper } from "./account.helper";
import { RpcException } from "@nestjs/microservices";
@Injectable()
export class AccountService {
  private readonly logger: Logger = new Logger(AccountService.name);
  constructor(private readonly accountRepository: AccountRepository, private readonly accountHelper: AccountHelper) {}

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
      return this.accountHelper.buildVerifyAccountResponse(account);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getAllAccounts(offset: number, limit: number, role: AccountRoleEnum = undefined) {
    try {
      return this.accountRepository.getAllAccounts(offset, limit, role);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getAccountInfoWithRole(id: string, role: AccountRoleEnum) {
    try {
      const account = await this.accountRepository.getAccountInfoWithRole(id, role);
      return this.accountHelper.buildGetAccountInfoResponse(account);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getAccountInfo(id: string) {
    try {
      const account = await this.accountRepository.getAccountInfo(id);
      return this.accountHelper.buildGetAccountInfoResponse(account);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async updateAccount(id: string, body: UpdateAccountByAdminDto | UdpateAccountDto) {
    try {
      const { info, ...rest } = body;
      const updatedAccount = await this.accountRepository.updateOne({ where: { id } }, rest);
      const updatedInfo = await this.accountHelper.updateInfoData(info, id, updatedAccount.role);
      return { ...updatedAccount, info: updatedInfo };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
