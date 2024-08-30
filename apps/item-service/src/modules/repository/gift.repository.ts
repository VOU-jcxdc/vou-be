import { BaseRepository, Gift } from "@database";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class GiftRepository extends BaseRepository<Gift> {
  constructor(@InjectRepository(Gift) repository: Repository<Gift>) {
    super(repository);
  }

  async checkExisted(giftId: string) {
    const request = await this.repository.findOne({ where: { id: giftId } });
    if (!request) throw new NotFoundException("The gift request does not existed");
    return request;
  }
}
