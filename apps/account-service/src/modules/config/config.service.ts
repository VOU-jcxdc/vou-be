import { HttpException, Injectable, Logger } from "@nestjs/common";
import { RedisService } from "@shared-modules";
import { AccountRoleEnum } from "@types";

@Injectable()
export class GameConfigService {
  private readonly logger: Logger = new Logger(GameConfigService.name);
  constructor(private readonly redisSerivce: RedisService) {}

  async addGameConfig(accountId: string, role: string) {
    try {
      if (role !== AccountRoleEnum.PLAYER) return true;
      return this.redisSerivce.set(`config-user-${accountId}-event-*`, 10);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }
}
