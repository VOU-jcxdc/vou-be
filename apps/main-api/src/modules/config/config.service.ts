import { HttpException, Injectable, Logger } from "@nestjs/common";
import { RedisService } from "@shared-modules";
import { AddConfigsDto, ICurrentUser, ValidateConfigsDto } from "@types";

@Injectable()
export class GameConfigService {
  private readonly logger = new Logger(GameConfigService.name);

  constructor(private readonly redisService: RedisService) {}

  async getConfigsInEvent(eventId: string, user: ICurrentUser) {
    try {
      const userConfig = await this.redisService.get(`config-user-${user.userId}-event-*`);
      const eventConfig = await this.redisService.get(`config-user-${user.userId}-event-${eventId}`);

      return {
        userConfig: userConfig ? Number(userConfig) : 0,
        eventConfig: eventConfig ? Number(eventConfig) : 0,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  async addConfigsInEvent(data: AddConfigsDto, user: ICurrentUser) {
    try {
      const rawEventConfigs = data.eventId
        ? await this.redisService.get(`config-user-${user.userId}-event-${data.eventId}`)
        : 0;
      const rawUserConfigs = await this.redisService.get(`config-user-${user.userId}-event-*`);

      let eventConfigs = rawEventConfigs ? Number(rawEventConfigs) : 0;
      let userConfigs = rawUserConfigs ? Number(rawUserConfigs) : 0;

      // Check value is positive or negative
      if (data.config < 0) {
        if (eventConfigs + userConfigs >= Math.abs(data.config)) {
          let comsumer = Math.abs(data.config);

          let tmp = Math.min(eventConfigs, comsumer);
          comsumer -= tmp;
          eventConfigs -= tmp;

          tmp = Math.min(userConfigs, comsumer);
          comsumer -= tmp;
          userConfigs -= tmp;
        } else throw new Error("Not enough configs");
      } else {
        // If data.eventId is null, add configs to userConfigs
        if (!data.eventId) userConfigs += data.config;
        else eventConfigs += data.config;
      }

      // Save configs
      if (data.eventId) await this.redisService.set(`config-user-${user.userId}-event-${data.eventId}`, eventConfigs);
      await this.redisService.set(`config-user-${user.userId}-event-*`, userConfigs);

      return {
        userConfig: userConfigs,
        eventConfig: eventConfigs,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  async validateConfigsInEvent(data: ValidateConfigsDto, user: ICurrentUser) {
    try {
      const rawEventConfigs = data.eventId ? await this.redisService.get(`config-${user.userId}-${data.eventId}`) : 0;
      const rawUserConfigs = await this.redisService.get(`config-user-${user.userId}-event-*`);

      const eventConfigs = rawEventConfigs ? Number(rawEventConfigs) : 0;
      const userConfigs = rawUserConfigs ? Number(rawUserConfigs) : 0;

      if (eventConfigs + userConfigs >= Math.abs(data.config)) return true;
      else return false;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }
}
