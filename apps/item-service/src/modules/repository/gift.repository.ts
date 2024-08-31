import { BaseRepository, Gift } from "@database";
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { IGift } from "@types";
import { Repository } from "typeorm";

@Injectable()
export class GiftRepository extends BaseRepository<Gift> {
  constructor(@InjectRepository(Gift) repository: Repository<Gift>) {
    super(repository);
  }

  async checkExisted(giftId: string) {
    const request = await this.repository.findOne({ where: { id: giftId } });
    if (!request) throw new RpcException("The gift request does not existed");
    return request;
  }

  checkPermissionUpdate(gift: IGift, accountId: string) {
    if (gift.receiverId == accountId) return;
    throw new RpcException("No permission to update gift");
  }
}
