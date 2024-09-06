import { Body, Controller } from "@nestjs/common";
import { GiftService } from "./gift.service";
import { CreateGiftRequestDto, SendGiftDto } from "@types";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class GiftController {
  constructor(private readonly giftService: GiftService) {}

  @MessagePattern({ method: "GET", path: "gifts/received-requests/:receiverId" })
  getReceivedRequests(@Payload("receiverId") receiverId: string) {
    return this.giftService.getGiftRequestsByReceiverId(receiverId);
  }

  @MessagePattern({ method: "GET", path: "gifts/sent-requests/:senderId" })
  getSentRequests(@Payload("senderId") senderId: string) {
    return this.giftService.getGiftRequestsBySenderId(senderId);
  }

  @MessagePattern({ method: "POST", path: "gifts" })
  createGiftRequest(@Body() data: CreateGiftRequestDto) {
    return this.giftService.createGiftRequest(data);
  }

  @MessagePattern({ method: "PUT", path: "gifts/:giftId" })
  acceptGiftRequest(@Payload() { accountId, giftId }: { accountId: string; giftId: string }) {
    return this.giftService.acceptGiftRequest(giftId, accountId);
  }

  @MessagePattern({ method: "DELETE", path: "gifts/:giftId" })
  rejectGiftRequest(@Payload() { accountId, giftId }: { accountId: string; giftId: string }) {
    return this.giftService.rejectGiftRequest(giftId, accountId);
  }

  @MessagePattern({ method: "POST", path: "gifts/sending" })
  sendGift(@Payload() data: SendGiftDto) {
    return this.giftService.sendGift(data);
  }
}
