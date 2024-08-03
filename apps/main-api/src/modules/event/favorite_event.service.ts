import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { AddFavoriteEventDto } from "@types";
import { catchError, lastValueFrom } from "rxjs";

@Injectable()
export class FavoriteEventService {
  private client: ClientProxy;

  constructor(@Inject("EVENT_SERVICE") private readonly options: ClientOptions) {
    this.client = ClientProxyFactory.create(options);
  }

  async addFavoriteEvent(dto: AddFavoriteEventDto, userId: string) {
    const reqData = { ...dto, userId };
    const rawData = this.client.send({ method: "POST", path: "events/favorite-events" }, reqData).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    return lastValueFrom(rawData);
  }

  async deleteFavoriteEvent(eventId: string, userId: string) {
    const reqData = { eventId, userId };
    const rawData = this.client.send({ method: "DELETE", path: "events/favorite-events/:id" }, reqData).pipe(
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
    const rawData = this.client.send({ method: "GET", path: "events/favorite-events" }, reqData).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    return lastValueFrom(rawData);
  }
}
