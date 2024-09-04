import { Injectable, Logger } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { RedisService } from "@shared-modules";
import { AddConfigsDto } from "@types";

@Injectable()
export class QuizgameConfigService {
  private readonly logger = new Logger(QuizgameConfigService.name);

  constructor(private readonly redisService: RedisService) {}

  async getConfigsInEvent(data: { eventId: string; userId: string }) {
    try {
      const userConfig = await this.redisService.get(`config-${data.userId}-*`);
      const eventConfig = await this.redisService.get(`config-${data.userId}-${data.eventId}`);

      return {
        userConfig: userConfig ? Number(userConfig) : 0,
        eventConfig: eventConfig ? Number(eventConfig) : 0,
      };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async addConfigsInEvent(data: AddConfigsDto & { userId: string }) {
    try {
      const rawEventConfigs = data.eventId ? await this.redisService.get(`config-${data.userId}-${data.eventId}`) : 0;
      const rawUserConfigs = await this.redisService.get(`config-${data.userId}-*`);

      let eventConfigs = rawEventConfigs ? Number(rawEventConfigs) : 0;
      let userConfigs = rawUserConfigs ? Number(rawUserConfigs) : 0;

      // Check value is positive or negative
      if (data.configs < 0) {
        if (eventConfigs + userConfigs >= Math.abs(data.configs)) {
          let comsumer = Math.abs(data.configs);

          let tmp = Math.min(eventConfigs, comsumer);
          comsumer -= tmp;
          eventConfigs -= tmp;

          tmp = Math.min(userConfigs, comsumer);
          comsumer -= tmp;
          userConfigs -= tmp;
        } else throw new RpcException("Not enough configs");
      } else {
        // If data.eventId is null, add configs to userConfigs
        if (!data.eventId) userConfigs += data.configs;
        else eventConfigs += data.configs;
      }

      // Save configs
      if (data.eventId) await this.redisService.set(`config-${data.userId}-${data.eventId}`, eventConfigs);
      await this.redisService.set(`config-${data.userId}-*`, userConfigs);

      return {
        userConfig: userConfigs,
        eventConfig: eventConfigs,
      };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
