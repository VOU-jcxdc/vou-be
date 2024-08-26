import { Injectable, Logger } from "@nestjs/common";
import { EventRepository } from "../repository/event.repository";
import { AccountRoleEnum, CreateEventDto, ICurrentUser, UpdateEventDto } from "@types";
import { RpcException } from "@nestjs/microservices";
import { EventImageRepository } from "../repository/event-image.repository";
import { EventHelper } from "./event.helper";
import { EventImage } from "@database";

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
      const { vouchers, ...rest } = dto;

      const images =
        dto.images.map((id) => {
          const image = new EventImage();
          image.bucketId = id;
          return image;
        }) || [];

      const newEvent = await this.eventRepository.save({
        ...rest,
        images,
      });

      return this.eventHelper.buildResponseFromEvent(newEvent);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async updateEvent(dto: UpdateEventDto & { brandId: string; eventId: string }) {
    try {
      const event = await this.eventRepository.findOne({
        where: {
          id: dto.eventId,
          brandId: dto.brandId,
        },
      });

      if (!event) {
        throw new RpcException("Event related to this brand not found");
      }

      const { images, ...rest } = dto;

      const updatedEvent = await this.eventRepository.save({
        ...event,
        ...rest,
      });

      if (images) {
        await this.eventImageRepository.delete({
          eventId: updatedEvent.id,
        });

        const newEventImages = images.map((i) => {
          return {
            eventId: updatedEvent.id,
            bucketId: i,
          };
        });

        await this.eventImageRepository.saveMany(newEventImages);
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
        events: await Promise.all(
          events.events.map((event) => this.eventHelper.buildResponseFromEvent(event, user.userId))
        ),
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

      return this.eventHelper.buildResponseFromEvent(event, user.userId);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
