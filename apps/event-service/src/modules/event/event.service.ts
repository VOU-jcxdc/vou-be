import { Inject, Injectable, Logger } from "@nestjs/common";
import { EventRepository } from "../repository/event.repository";
import { AccountRoleEnum, CreateEventDto, ICurrentUser, UpdateEventDto, VOUCHER_SERVICE_PROVIDER_NAME } from "@types";
import { ClientOptions, ClientProxy, ClientProxyFactory, RpcException } from "@nestjs/microservices";
import { EventImageRepository } from "../repository/event-image.repository";
import { EventHelper } from "./event.helper";
import { EventImage } from "@database";
import { catchError, lastValueFrom } from "rxjs";

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);
  private voucherClient: ClientProxy;

  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventImageRepository: EventImageRepository,
    private readonly eventHelper: EventHelper,
    @Inject(VOUCHER_SERVICE_PROVIDER_NAME) voucherOptions: ClientOptions
  ) {
    this.voucherClient = ClientProxyFactory.create(voucherOptions);
  }

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

      const rawVouchers = this.voucherClient
        .send(
          { method: "POST", path: "/vouchers" },
          {
            eventId: newEvent.id,
            vouchers,
          }
        )
        .pipe(
          catchError((error) => {
            throw new RpcException(error);
          })
        );

      await lastValueFrom(rawVouchers);

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
        const oldImages = updatedEvent.images;
        const updatedImages = images.map((id) => {
          const image = new EventImage();
          image.bucketId = id;
          return image;
        });

        await this.eventRepository.save({
          ...updatedEvent,
          images: [...updatedImages],
        });

        for (const oldImage of oldImages) {
          await this.eventImageRepository.delete({ id: oldImage.id });
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
