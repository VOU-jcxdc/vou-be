import { BaseRepository, Event } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class EventRepository extends BaseRepository<Event> {
  constructor(@InjectRepository(Event) repository: Repository<Event>) {
    super(repository);
  }
}
