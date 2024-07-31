import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { CreateEventDto, ICurrentUser, UpdateEventDto } from "@types";
import { catchError, lastValueFrom } from "rxjs";

@Injectable()
export class EventService {
  private client: ClientProxy;

  constructor(@Inject("EVENT_SERVICE") private readonly options: ClientOptions) {
    this.client = ClientProxyFactory.create(options);
  }

  async createEvent(userId: string, dto: CreateEventDto) {
    const reqData = {
      ...dto,
      brandId: userId,
    };

    const rawData = this.client.send({ method: "POST", path: "/events" }, reqData).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    return lastValueFrom(rawData);
  }

  async updateEvent(userId: string, dto: UpdateEventDto) {
    const reqData = {
      ...dto,
      brandId: userId,
    };

    const rawData = this.client.send({ method: "PUT", path: "/events" }, reqData).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    return lastValueFrom(rawData);
  }

  async getEvents(user: ICurrentUser, offset: number, limit: number) {
    const reqData = { user, offset, limit };

    const rawData = this.client.send({ method: "GET", path: "/events" }, reqData).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    return lastValueFrom(rawData);
  }

  async getEventById(user: ICurrentUser, id: string) {
    const reqData = { user, id };

    const rawData = this.client.send({ method: "GET", path: "/events/:id" }, reqData).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    return lastValueFrom(rawData);
  }
}
