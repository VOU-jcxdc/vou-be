import { Injectable, Logger } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { RedisService } from "@shared-modules";

@Injectable()
export class GameConfigService {
  private readonly logger = new Logger(GameConfigService.name);

  constructor(private readonly redisService: RedisService) {}

  async receiveItem(senderId: string, itemId: string, quantity: number) {
    try {
      const rawEventConfigs = await this.redisService.get(`config-user-${senderId}-event-${itemId}`);
      const eventConfig = rawEventConfigs ? Number(rawEventConfigs) : 0;
      return this.redisService.set(`config-user-${senderId}-event-${itemId}`, quantity + eventConfig);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async loseItem(receiverId: string, itemId: string, quantity: number) {
    try {
      const rawEventConfigs = await this.redisService.get(`config-user-${receiverId}-event-${itemId}`);
      const eventConfig = rawEventConfigs ? Number(rawEventConfigs) : 0;

      if (eventConfig < quantity) throw new Error("Not enough configs");

      return this.redisService.set(`config-user-${receiverId}-event-${itemId}`, eventConfig - quantity);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
