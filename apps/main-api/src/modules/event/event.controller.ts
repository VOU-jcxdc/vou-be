import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { EventService } from "./event.service";
import {
  AccountRoleEnum,
  AddVoucherToAccountDto,
  CreateEventDto,
  DeleteVoucherDto,
  ICurrentUser,
  UpdateEventDto,
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

  @Put()
  @Roles(AccountRoleEnum.BRAND)
  async updateEvent(@CurrentUser() user: ICurrentUser, @Body() dto: UpdateEventDto) {
    return this.eventService.updateEvent(user.userId, dto);
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
}