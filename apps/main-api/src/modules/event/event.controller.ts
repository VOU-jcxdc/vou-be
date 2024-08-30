import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { EventService } from "./event.service";
import {
  AccountRoleEnum,
  AddVoucherToAccountDto,
  CreateEventDto,
  CreateItemDto,
  DeleteVoucherDto,
  ICurrentUser,
  UpdateEventDto,
  UpdateItemDto,
} from "@types";
import { Roles } from "../../decorators/roles.decorator";
import { JwtAuthGuard, RoleGuard } from "../../guard";
import { CurrentUser } from "../../decorators";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("events")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @Roles(AccountRoleEnum.BRAND)
  async createEvent(@CurrentUser() user: ICurrentUser, @Body() dto: CreateEventDto) {
    return this.eventService.createEvent(user.userId, dto);
  }

  @Post("vouchers/assigning")
  @Roles(AccountRoleEnum.PLAYER)
  async assignVoucher(@CurrentUser() user: ICurrentUser, @Body() data: AddVoucherToAccountDto) {
    return this.eventService.assignVoucherInEvent(user.userId, data);
  }

  @Post("/:id/items/assigning")
  @Roles(AccountRoleEnum.PLAYER)
  async assignItem(@CurrentUser() user: ICurrentUser, @Param("id") eventId: string) {
    return this.eventService.assignItemInEvent(user.userId, eventId);
  }

  @Post(":id/items")
  @Roles(AccountRoleEnum.BRAND)
  async createItems(@Param("id") eventId: string, @Body() dto: CreateItemDto) {
    return this.eventService.createItemsInEvent(eventId, dto);
  }

  @Put(":id/items/:itemId")
  @Roles(AccountRoleEnum.BRAND)
  async updateItemInEvent(@Param("itemId") itemId: string, @Body() dto: UpdateItemDto) {
    return this.eventService.updateItemDetail(itemId, dto);
  }

  @Put(":id")
  @Roles(AccountRoleEnum.BRAND)
  async updateEvent(@CurrentUser() user: ICurrentUser, @Body() dto: UpdateEventDto, @Param("id") eventId: string) {
    return this.eventService.updateEvent(user.userId, dto, eventId);
  }

  @Get()
  @Roles(AccountRoleEnum.BRAND, AccountRoleEnum.PLAYER)
  async getEvents(
    @CurrentUser() user: ICurrentUser,
    @Query("offset", ParseIntPipe) offset: number,
    @Query("limit", ParseIntPipe) limit: number
  ) {
    return this.eventService.getEvents(user, offset, limit);
  }

  @Get(":id/vouchers")
  @Roles(AccountRoleEnum.BRAND, AccountRoleEnum.PLAYER)
  async getVouchersInEvent(@Param("id") id: string) {
    return this.eventService.getVouchersInEvent(id);
  }

  @Get(":id/items")
  @Roles(AccountRoleEnum.BRAND, AccountRoleEnum.PLAYER)
  async getItemsInEvent(@Param("id") id: string) {
    return this.eventService.getItemsInEvent(id);
  }

  @Get(":id")
  @Roles(AccountRoleEnum.BRAND, AccountRoleEnum.PLAYER)
  async getEventById(@CurrentUser() user: ICurrentUser, @Param("id") id: string) {
    return this.eventService.getEventById(user, id);
  }

  @Delete(":id/vouchers")
  @Roles(AccountRoleEnum.BRAND)
  async deleteVouchersInEvent(@Param("id") id: string, @Body() data: DeleteVoucherDto) {
    return this.eventService.deleteVouchersInEvent(id, data);
  }

  @Delete(":id/items/:itemId")
  @Roles(AccountRoleEnum.BRAND)
  async deleteItemInEvent(@Param("itemId") itemId: string) {
    return this.eventService.deleteItemInEvent(itemId);
  }

  @Get(":id/recipes")
  @Roles(AccountRoleEnum.BRAND, AccountRoleEnum.PLAYER)
  async getRecipesInEvent(@Param("id") id: string) {
    return this.eventService.getRecipesInEvent(id);
  }
}
