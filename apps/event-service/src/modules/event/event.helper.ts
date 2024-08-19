import { Injectable } from "@nestjs/common";
import { EventImageRepository } from "../repository/event-image.repository";
import { Event } from "@database";
import { FavoriteEventRepository } from "../repository/favorite_event.repository";

@Injectable()
export class EventHelper {
  constructor(
    private readonly favoriteEventRepository: FavoriteEventRepository,
    private readonly eventImageRepository: EventImageRepository
  ) {}

  async findImagesByEventId(eventId: string) {
    const images = await this.eventImageRepository.findAll({ where: { eventId } });
    return images.map((image) => image.bucketId);
  }

  /* eslint-disable @typescript-eslint/no-inferrable-types */
  async buildResponseFromEvent(event: Event, userId: string = "") {
    return {
      ...event,
      images: await this.findImagesByEventId(event.id),
      favorite: await this.isFavoriteEvent(event.id, userId),
    };
  }
  /* eslint-enable @typescript-eslint/no-inferrable-types */

  async isFavoriteEvent(eventId: string, userId: string) {
    if (!userId) return undefined;

    return (await this.favoriteEventRepository.findOne({
      where: {
        accountId: userId,
        eventId,
      },
    }))
      ? true
      : undefined;
  }
}
