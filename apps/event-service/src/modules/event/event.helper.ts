import { Injectable } from "@nestjs/common";
import { EventImageRepository } from "../repository/event-image.repository";
import { EventRepository } from "../repository/event.repository";
import { Event } from "@database";

@Injectable()
export class EventHelper {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventImageRepository: EventImageRepository
  ) {}

  async findImagesByEventId(eventId: string) {
    const images = await this.eventImageRepository.findAll({ where: { eventId } });
    return images.map((image) => image.bucketId);
  }

  async buildResponseFromId(eventId: string) {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    return {
      ...event,
      images: await this.findImagesByEventId(eventId),
    };
  }

  async buildResponseFromEvent(event: Event) {
    return {
      ...event,
      images: await this.findImagesByEventId(event.id),
    };
  }
}
