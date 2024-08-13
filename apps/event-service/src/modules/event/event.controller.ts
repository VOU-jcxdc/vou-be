import { Controller } from "@nestjs/common";
import { EventService } from "./event.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateEventDto, ICurrentUser, UpdateEventDto } from "@types";

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern({ method: "POST", path: "/events" })
  async createEvent(@Payload() dto: CreateEventDto & { brandId: string }) {
    return this.eventService.createEvent(dto);
  }

  @MessagePattern({ method: "PUT", path: "/events" })
  async updateEvent(@Payload() dto: UpdateEventDto & { brandId: string; eventId: string }) {
    return this.eventService.updateEvent(dto);
  }

  @MessagePattern({ method: "GET", path: "/events" })
  async getEvents(@Payload() data: { user: ICurrentUser; offset: number; limit: number }) {
    return this.eventService.getEvents(data.user, data.offset, data.limit);
  }

  @MessagePattern({ method: "GET", path: "/events/:id" })
  async getEventById(@Payload() data: { user: ICurrentUser; id: string }) {
    return this.eventService.getEventById(data.user, data.id);
  }
}
