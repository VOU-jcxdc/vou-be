import { Injectable, Logger } from "@nestjs/common";
import { EventRepository } from "../repository/event.repository";
import { AccountRoleEnum, CreateEventDto, ICurrentUser, UpdateEventDto } from "@types";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(private readonly eventRepository: EventRepository) {}

  async createEvent(dto: CreateEventDto & { userId: string }) {
    try {
      return this.eventRepository.save(dto);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async updateEvent(dto: UpdateEventDto & { userId: string }) {
    try {
      const event = await this.eventRepository.findOne({
        where: {
          id: dto.id,
          brandId: dto.userId,
        },
      });

      if (!event) {
        throw new RpcException("Event related to this brand not found");
      }

      return this.eventRepository.save({ ...event, ...dto });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getEvents(user: ICurrentUser, offset: number, limit: number) {
    try {
      return this.eventRepository.findAllByRole(user, offset, limit);
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

      return event;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
