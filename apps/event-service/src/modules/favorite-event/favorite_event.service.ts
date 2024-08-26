import { Injectable, Logger } from "@nestjs/common";
import { FavoriteEventRepository } from "../repository/favorite_event.repository";
import { AddFavoriteEventDto } from "@types";
import { RpcException } from "@nestjs/microservices";
import { EventRepository } from "../repository/event.repository";
import { EventHelper } from "../event/event.helper";

@Injectable()
export class FavoriteEventService {
  private readonly logger = new Logger(FavoriteEventService.name);

  constructor(
    private readonly favoriteEventRepository: FavoriteEventRepository,
    private readonly eventRepository: EventRepository,
    private readonly eventHelper: EventHelper
  ) {}

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

      const existedEvent = await this.eventRepository.findNotExpiredEvent(dto.eventId);

      await this.favoriteEventRepository.save({
        eventId: existedEvent.id,
        accountId: dto.userId,
      });

      return await this.eventHelper.buildResponseFromEvent(existedEvent);
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
      const data = await this.favoriteEventRepository.getFavoriteEvents(offset, limit, userId);
      return {
        total: data.total,
        limit: data.limit,
        offset: data.offset,
        events: await Promise.all(data.favoriteEvents.map((event) => this.eventHelper.buildResponseFromEvent(event))),
      };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getFavoriteAccountIds(eventId: string) {
    try {
      const favEvents = await this.favoriteEventRepository.findAll({ where: { eventId } });
      const event = await this.eventRepository.findOne({ where: { id: eventId } });
      const accountIds = favEvents.map((favEvent) => favEvent.accountId);
      return {
        accountIds,
        event: {
          name: event.name,
          description: event.description,
          beginDate: event.beginDate,
        },
      };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
