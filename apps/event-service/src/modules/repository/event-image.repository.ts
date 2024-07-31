import { BaseRepository, EventImage } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class EventImageRepository extends BaseRepository<EventImage> {
  constructor(@InjectRepository(EventImage) repository: Repository<EventImage>) {
    super(repository);
  }
}
