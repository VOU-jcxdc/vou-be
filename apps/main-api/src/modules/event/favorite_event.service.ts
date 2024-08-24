import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { AddFavoriteEventDto, EVENT_SERVICE_PROVIDER_NAME } from "@types";
import { catchError, lastValueFrom } from "rxjs";
import { EventHelper } from "./event.helper";
import { Event } from "@database";

@Injectable()
export class FavoriteEventService {
  private eventClient: ClientProxy;

  constructor(
    @Inject(EVENT_SERVICE_PROVIDER_NAME) eventOptions: ClientOptions,
    private readonly eventHelper: EventHelper
  ) {
    this.eventClient = ClientProxyFactory.create(eventOptions);
  }

  async addFavoriteEvent(dto: AddFavoriteEventDto, userId: string) {
    const reqData = { ...dto, userId };
    const rawData = this.eventClient.send({ method: "POST", path: "events/favorite-events" }, reqData).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    const event = await lastValueFrom(rawData);
    return this.eventHelper.buildEventResponse(event);
  }

  async deleteFavoriteEvent(eventId: string, userId: string) {
    const reqData = { eventId, userId };
    const rawData = this.eventClient.send({ method: "DELETE", path: "events/favorite-events/:id" }, reqData).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    return lastValueFrom(rawData);
  }

  async getFavoriteEvents(offset: number, limit: number, userId: string) {
    const reqData = { offset, limit, userId };
    const rawData = this.eventClient.send({ method: "GET", path: "events/favorite-events" }, reqData).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    const data = await lastValueFrom(rawData);
    return {
      total: data.total,
      offset: data.offset,
      limit: data.limit,
      events: await Promise.all(
        data.events.map((event: Event & { images: string[] }) => this.eventHelper.buildEventResponse(event))
      ),
    };
  }
}
