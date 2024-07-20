import { Injectable } from "@nestjs/common";
import { EventRepository } from "../repository/event.repository";

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async findAll() {
    return this.eventRepository.findAll();
  }
}
