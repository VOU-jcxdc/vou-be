import { Injectable, Logger } from "@nestjs/common";
import { GiftRepository } from "../repository/gift.repository";
import { CreateGiftRequestDto, GiftStatusEnum, SendGiftDto, ItemTypeEnum } from "@types";
import { ItemService } from "../item/item.service";
import { In } from "typeorm";
import { RpcException } from "@nestjs/microservices";
import { GameConfigService } from "../config/config.service";

@Injectable()
export class GiftService {
  private readonly logger: Logger = new Logger(GiftService.name);
  constructor(
    private readonly giftRepository: GiftRepository,
    private readonly itemService: ItemService,
    private readonly gameConfigService: GameConfigService
  ) {}

  async getGiftRequestsBySenderId(senderId: string) {
    try {
      return this.giftRepository.findAll({
        where: {
          senderId,
          status: In([GiftStatusEnum.REQUESTED, GiftStatusEnum.REJECTED]),
        },
        relations: {
          item: true,
        },
        select: ["id", "senderId", "receiverId", "sendDate", "status", "quantity", "item"],
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getGiftRequestsByReceiverId(receiverId: string) {
    try {
      return this.giftRepository.findAll({
        where: {
          receiverId,
          status: GiftStatusEnum.REQUESTED,
        },
        relations: {
          item: true,
        },
        select: ["id", "senderId", "receiverId", "sendDate", "status", "quantity", "item"],
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async createGiftRequest(data: CreateGiftRequestDto) {
    try {
      return this.giftRepository.save({
        ...data,
        status: GiftStatusEnum.REQUESTED,
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async acceptGiftRequest(giftId: string, accountId: string) {
    try {
      const request = await this.giftRepository.checkExisted(giftId);
      this.giftRepository.checkPermissionUpdate(request, accountId);

      // Handle config item
      if (await this.itemService.isConfigItem(request.itemId)) {
        await this.gameConfigService.loseItem(request.senderId, request.itemId, request.quantity);
        await this.gameConfigService.receiveItem(request.receiverId, request.itemId, request.quantity);
        await this.giftRepository.updateOne(
          { where: { id: giftId } },
          {
            status: GiftStatusEnum.ACCEPTED,
          }
        );

        return true;
      }

      // Handle normal item
      const { senderId, receiverId, itemId } = request;
      const accountItem = await this.itemService.loseItem(receiverId, itemId, request.quantity);
      await this.itemService.receiveItem(senderId, itemId, request.quantity);
      await this.giftRepository.updateOne(
        { where: { id: giftId } },
        {
          status: GiftStatusEnum.ACCEPTED,
        }
      );
      return accountItem;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async rejectGiftRequest(giftId: string, accountId: string) {
    try {
      const request = await this.giftRepository.checkExisted(giftId);
      this.giftRepository.checkPermissionUpdate(request, accountId);
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
      throw new RpcException(error);
    }
  }

  async sendGift({ senderId, receiverId, itemId }: SendGiftDto) {
    try {
      const accountItem = await this.itemService.loseItem(senderId, itemId, 1);
      await this.itemService.receiveItem(receiverId, itemId, 1);
      return accountItem;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
