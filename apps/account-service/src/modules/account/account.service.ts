import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { AccountRepository } from "../repository/account.repository";
import { BrandInfoRepository } from "../repository/brand-info.repository";
import { PlayerInfoRepository } from "../repository/player-info.repository";
import { AccountRoleEnum, CreateAccountDto, CreatePlayerInfoDto, CreateBrandInfoDto } from "@types";
import { AccountHelper } from "./account.helper";
import * as bcrypt from "bcrypt";
@Injectable()
export class AccountService {
  private readonly logger: Logger;
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly brandInfoRepository: BrandInfoRepository,
    private readonly playerInfoRepository: PlayerInfoRepository,

    private readonly accountHelper: AccountHelper
  ) {
    this.logger = new Logger(AccountService.name);
  }

  async createAccount(value: CreateAccountDto) {
    try {
      const { password, data, ...rest } = value;
      const hashedPassword = await this.hashPassword(password);
      const newAccount = await this.accountRepository.createAccount({
        ...rest,
        password: hashedPassword,
      });
      await this.createInfoData(value.role, value.data, newAccount.id);
      return this.accountHelper.buildCreateAccountResponse(newAccount);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async createInfoData(role: AccountRoleEnum, data: CreateBrandInfoDto | CreatePlayerInfoDto, accountId: string) {
    if (role === AccountRoleEnum.BRAND) {
      const brandData = data as CreateBrandInfoDto;
      return this.brandInfoRepository.createBrandInfo(brandData, accountId);
    } else if (role === AccountRoleEnum.PLAYER) {
      const playerData = data as CreatePlayerInfoDto;
      return this.playerInfoRepository.create({
        accountId,
        ...playerData,
      });
    }
  }

  async hashPassword(password: string) {
    const saltOrRounds = await bcrypt.genSalt();
    return bcrypt.hash(password, saltOrRounds);
  }
}
