import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard, RoleGuard } from "../../guard";
import { AccountRoleEnum, CreateGiftRequestDto, ICurrentUser, SendGiftDto, SendGiftGatewayDto } from "@types";
import { CurrentUser } from "../../decorators";
import { Roles } from "../../decorators/roles.decorator";
import { GiftService } from "./gift.service";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("gifts")
@Roles(AccountRoleEnum.PLAYER)
export class GiftController {
  constructor(private readonly service: GiftService) {}

  @Get("/received-requests")
  async getReceivedRequests(@CurrentUser() user: ICurrentUser) {
    return this.service.getReceivedRequests(user.userId);
  }

  @Get("/sent-requests")
  async getSentRequests(@CurrentUser() user: ICurrentUser) {
    return this.service.getSentRequests(user.userId);
  }

  @Post("")
  async createGiftRequest(@Body() dto: CreateGiftRequestDto) {
    return this.service.createGiftRequest(dto);
  }

  @Post("sending")
  async sendGift(@CurrentUser() user: ICurrentUser, @Body() dto: SendGiftGatewayDto) {
    return this.service.sendGift({ senderId: user.userId, ...dto });
  }

  @Put("/:giftId")
  async acceptGiftRequest(@Param("giftId") giftId: string, @CurrentUser() user: ICurrentUser) {
    return this.service.acceptGiftRequest(giftId, user.userId);
  }

  @Delete("/:giftId")
  async rejectGiftRequest(@Param("giftId") giftId: string, @CurrentUser() user: ICurrentUser) {
    return this.service.rejectGiftRequest(giftId, user.userId);
  }
}
