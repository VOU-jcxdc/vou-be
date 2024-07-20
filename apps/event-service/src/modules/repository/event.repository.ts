import { BaseRepository, Event } from "@database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IEvent } from "@types";
import { Repository } from "typeorm";

@Injectable()
export class EventRepository extends BaseRepository<IEvent> {
  constructor(@InjectRepository(Event) repository: Repository<Event>) {
    super(repository);
  }
}
