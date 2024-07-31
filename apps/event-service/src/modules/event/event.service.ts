import { Injectable, Logger } from "@nestjs/common";
import { EventRepository } from "../repository/event.repository";
import { AccountRoleEnum, CreateEventDto, ICurrentUser, UpdateEventDto } from "@types";
import { RpcException } from "@nestjs/microservices";
import { EventImageRepository } from "../repository/event-image.repository";
import { EventHelper } from "./event.helper";

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventImageRepository: EventImageRepository,
    private readonly eventHelper: EventHelper
  ) {}

  async createEvent(dto: CreateEventDto & { brandId: string }) {
    try {
      const newEvent = await this.eventRepository.save({
        ...dto,
        images: undefined,
      });

      for (const bucketId of dto.images) {
        await this.eventImageRepository.save({ bucketId, eventId: newEvent.id });
      }

      return this.eventHelper.buildResponseFromEvent(newEvent);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async updateEvent(dto: UpdateEventDto & { brandId: string }) {
    try {
      const event = await this.eventRepository.findOne({
        where: {
          id: dto.id,
          brandId: dto.brandId,
        },
      });

      if (!event) {
        throw new RpcException("Event related to this brand not found");
      }

      const updatedEvent = await this.eventRepository.save({
        ...event,
        ...dto,
        images: undefined,
      });

      if (dto.images) {
        await this.eventImageRepository.delete({ eventId: updatedEvent.id });
        for (const bucketId of dto.images) {
          await this.eventImageRepository.save({ bucketId, eventId: updatedEvent.id });
        }
      }

      return this.eventHelper.buildResponseFromEvent(updatedEvent);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getEvents(user: ICurrentUser, offset: number, limit: number) {
    try {
      const events = await this.eventRepository.findAllByRole(user, offset, limit);
      return {
        ...events,
        events: await Promise.all(events.events.map((event) => this.eventHelper.buildResponseFromEvent(event))),
      };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getEventById(user: ICurrentUser, id: string) {
    try {
      const event = await this.eventRepository.findOne({
        where: {
          id,
          brandId: user.role === AccountRoleEnum.BRAND ? user.userId : undefined,
        },
      });

      if (!event) {
        throw new RpcException("Event not found");
      }

      return this.eventHelper.buildResponseFromEvent(event);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
