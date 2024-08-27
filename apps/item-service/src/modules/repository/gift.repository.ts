import { BaseRepository, Gift } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class GiftRepository extends BaseRepository<Gift> {
  constructor(@InjectRepository(Gift) repository: Repository<Gift>) {
    super(repository);
  }
}
