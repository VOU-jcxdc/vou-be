import { Injectable, Logger } from "@nestjs/common";
import { FavoriteEventRepository } from "../repository/favorite_event.repository.module";
import { AddFavoriteEventDto } from "@types";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class FavoriteEventService {
  private readonly logger = new Logger(FavoriteEventService.name);

  constructor(private readonly favoriteEventRepository: FavoriteEventRepository) {}

  async addFavoriteEvent(dto: AddFavoriteEventDto & { userId: string }) {
    try {
      const data = {
        eventId: dto.eventId,
        accountId: dto.userId,
      };

      const existedData = await this.favoriteEventRepository.findOne({
        where: data,
      });

      if (existedData) throw new RpcException("Event already in favorite lists");
      await this.favoriteEventRepository.save(data);
      return "OK";
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async deleteFavoriteEvent(eventId: string, accountId: string) {
    try {
      const data = { eventId, accountId };
      const result = await this.favoriteEventRepository.delete(data);
      return { affected: result.affected };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getFavoriteEvents(offset: number, limit: number, userId: string) {
    try {
      return await this.favoriteEventRepository.getFavoriteEvents(offset, limit, userId);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
