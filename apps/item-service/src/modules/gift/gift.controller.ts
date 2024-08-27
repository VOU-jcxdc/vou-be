import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { GiftService } from "./gift.service";
import { CreateGiftRequestDto } from "@types";

@Controller("gifts")
export class GiftController {
  constructor(private readonly giftService: GiftService) {}

  @Get("/received-requests/:receiverId")
  getReceivedRequests(@Param() { receiverId }: { receiverId: string }) {
    return this.giftService.getGiftRequestsByReceiverId(receiverId);
  }

  @Get("/sent-requests/:senderId")
  getSentRequests(@Param() { senderId }: { senderId: string }) {
    return this.giftService.getGiftRequestsBySenderId(senderId);
  }

  @Post()
  createGiftRequest(@Body() data: CreateGiftRequestDto) {
    return this.giftService.createGiftRequest(data);
  }

  @Put(":giftId")
  acceptGiftRequest(@Param() { giftId }: { giftId: string }) {
    return this.giftService.acceptGiftRequest(giftId);
  }

  @Delete(":giftId")
  rejectGiftRequest(@Param() { giftId }: { giftId: string }) {
    return this.giftService.rejectGiftRequest(giftId);
  }
}
