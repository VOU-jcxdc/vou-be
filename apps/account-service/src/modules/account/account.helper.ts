import { Injectable } from "@nestjs/common";
import { IAccount } from "@types";
import { AccountRoleEnum, CreateBrandInfoDto, CreatePlayerInfoDto } from "@types";
import { BrandInfoRepository } from "../repository/brand-info.repository";
import { PlayerInfoRepository } from "../repository/player-info.repository";
import * as bcrypt from "bcrypt";
@Injectable()
export class AccountHelper {
  constructor(
    private readonly brandInfoRepository: BrandInfoRepository,
    private readonly playerInfoRepository: PlayerInfoRepository
  ) {}

  buildCreateAccountResponse(data: IAccount) {
    return {
      id: data.id,
      phone: data.phone,
      username: data.username,
      email: data.email,
      role: data.role,
    };
  }

  buildVerifyAccountResponse(data: IAccount) {
    return {
      id: data.id,
      role: data.role,
    };
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

  async verifyPassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}
