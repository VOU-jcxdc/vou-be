import { Controller } from "@nestjs/common";
import { FavoriteEventService } from "./favorite_event.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AddFavoriteEventDto } from "@types";

@Controller()
export class FavoriteEventController {
  constructor(private readonly favoriteEventService: FavoriteEventService) {}

  @MessagePattern({ method: "POST", path: "events/favorite-events" })
  async addFavoriteEvent(@Payload() dto: AddFavoriteEventDto & { userId: string }) {
    return this.favoriteEventService.addFavoriteEvent(dto);
  }

  @MessagePattern({ method: "DELETE", path: "events/favorite-events/:id" })
  async deleteFavoriteEvent(@Payload() data: { eventId: string; userId: string }) {
    return this.favoriteEventService.deleteFavoriteEvent(data.eventId, data.userId);
  }

  @MessagePattern({ method: "GET", path: "events/favorite-events" })
  async getFavoriteEvents(@Payload() data: { offset: number; limit: number; userId: string }) {
    return this.favoriteEventService.getFavoriteEvents(data.offset, data.limit, data.userId);
  }
}
