import { Injectable, Logger } from "@nestjs/common";
import { EventRepository } from "../repository/event.repository";
import {
  AccountRoleEnum,
  CreateEventDto,
  DELAY_MESSAGE_EXCHANGE_NAME,
  EVENT_NOTIFICATION_ROUTING_KEY,
  ICurrentUser,
  UpdateEventDto,
} from "@types";
import { RpcException } from "@nestjs/microservices";
import { EventImageRepository } from "../repository/event-image.repository";
import { EventHelper } from "./event.helper";
import { EventImage } from "@database";
import { RabbitMqService } from "@shared-modules";
import moment from "moment";

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventImageRepository: EventImageRepository,
    private readonly eventHelper: EventHelper,
    private readonly rabbitMqService: RabbitMqService
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

      const oneHourBefore = moment(moment(newEvent.beginDate)).subtract(1, "hour");
      const delay = oneHourBefore.diff(moment());

      this.rabbitMqService.publishWithDelay(
        DELAY_MESSAGE_EXCHANGE_NAME,
        EVENT_NOTIFICATION_ROUTING_KEY,
        { eventId: newEvent.id, beginDate: newEvent.beginDate },
        delay
      );

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

      if (!moment(updatedEvent.beginDate).isSame(moment(event.beginDate))) {
        const oneHourBefore = moment(moment(updatedEvent.beginDate)).subtract(1, "hour");
        const delay = oneHourBefore.diff(moment());
        this.rabbitMqService.publishWithDelay(
          DELAY_MESSAGE_EXCHANGE_NAME,
          EVENT_NOTIFICATION_ROUTING_KEY,
          { eventId: updatedEvent.id, beginDate: updatedEvent.beginDate },
          delay
        );
      }

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
