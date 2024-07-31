import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard, RoleGuard } from "../../guard";
import { Roles } from "../../decorators/roles.decorator";
import { AccountRoleEnum, AddFavoriteEventDto, ICurrentUser } from "@types";
import { FavoriteEventService } from "./favorite_event.service";
import { CurrentUser } from "../../decorators";

@Controller("events/favorite-events")
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(AccountRoleEnum.PLAYER)
export class FavoriteEventController {
  constructor(private readonly favoriteEventService: FavoriteEventService) {}

  @Post()
  async addFavoriteEvent(@Body() dto: AddFavoriteEventDto, @CurrentUser() user: ICurrentUser) {
    return this.favoriteEventService.addFavoriteEvent(dto, user.userId);
  }

  @Delete(":id")
  async deleteFavoriteEvent(@Param("id") eventId: string, @CurrentUser() user: ICurrentUser) {
    return this.favoriteEventService.deleteFavoriteEvent(eventId, user.userId);
  }

  @Get()
  async getFavoriteEvents(
    @Query("offset", ParseIntPipe) offset: number,
    @Query("limit", ParseIntPipe) limit: number,
    @CurrentUser() user: ICurrentUser
  ) {
    return this.favoriteEventService.getFavoriteEvents(offset, limit, user.userId);
  }
}
