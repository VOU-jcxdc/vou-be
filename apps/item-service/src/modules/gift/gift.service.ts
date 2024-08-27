import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { GiftRepository } from "../repository/gift.repository";
import { CreateGiftRequestDto, GiftStatusEnum } from "@types";
import { AccountItemService } from "../account-item/account-item.service";

@Injectable()
export class GiftService {
  private readonly logger: Logger = new Logger(GiftService.name);
  constructor(
    private readonly giftRepository: GiftRepository,
    private readonly accountItemService: AccountItemService
  ) {}

  async createGiftRequest(data: CreateGiftRequestDto) {
    try {
      return this.giftRepository.save({
        ...data,
        status: GiftStatusEnum.REQUESTED,
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async acceptGiftRequest(giftId: string) {
    try {
      const request = await this.giftRepository.findOne({ where: { id: giftId } });
      if (!request) throw new NotFoundException("The gift request does not existed");
      const { receiverId, itemId } = request;
      const receiverItem = await this.accountItemService.getAccountItemByItemId(receiverId, itemId);
      if (!receiverItem || receiverItem.quantity < request.quantity) {
        throw new BadRequestException("Does not have enough items");
      }
      await this.giftRepository.updateOne(
        { where: { id: giftId } },
        {
          status: GiftStatusEnum.ACCEPTED,
        }
      );
      const newQuantity = receiverItem.quantity - request.quantity;
      return this.accountItemService.updateAccountItem(receiverId, itemId, newQuantity);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async rejectGiftRequest(giftId: string) {
    try {
      return this.giftRepository.updateOne(
        {
          where: { id: giftId },
        },
        {
          status: GiftStatusEnum.REJECTED,
        }
      );
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
