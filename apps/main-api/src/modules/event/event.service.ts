import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import {
  AddVoucherToAccountDto,
  CreateEventDto,
  CreateItemDto,
  DeleteVoucherDto,
  EVENT_SERVICE_PROVIDER_NAME,
  ICurrentUser,
  ITEM_SERVICE_PROVIDER_NAME,
  UpdateEventDto,
  UpdateItemDto,
  VOUCHER_SERVICE_PROVIDER_NAME,
} from "@types";
import { catchError, lastValueFrom } from "rxjs";
import { EventHelper } from "./event.helper";
import { Event } from "@database";

@Injectable()
export class EventService {
  private eventClient: ClientProxy;
  private voucherClient: ClientProxy;
  private itemClient: ClientProxy;

  constructor(
    @Inject(EVENT_SERVICE_PROVIDER_NAME) eventOptions: ClientOptions,
    @Inject(VOUCHER_SERVICE_PROVIDER_NAME) voucherOptions: ClientOptions,
    @Inject(ITEM_SERVICE_PROVIDER_NAME) itemOptions: ClientOptions,
    private readonly eventHelper: EventHelper
  ) {
    this.eventClient = ClientProxyFactory.create(eventOptions);
    this.voucherClient = ClientProxyFactory.create(voucherOptions);
    this.itemClient = ClientProxyFactory.create(itemOptions);
  }

  async createEvent(userId: string, dto: CreateEventDto) {
    const reqData = {
      ...dto,
      brandId: userId,
      vouchers: undefined,
    };

    const rawData = this.eventClient.send({ method: "POST", path: "/events" }, reqData).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    const event = await lastValueFrom(rawData);

    const rawVouchers = this.voucherClient
      .send({ method: "POST", path: "/vouchers" }, { eventId: event.id, brandId: userId, vouchers: dto.vouchers })
      .pipe(
        catchError((error) => {
          const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
          const message = error.message || "An error occurred";
          throw new HttpException(message, statusCode);
        })
      );

    await lastValueFrom(rawVouchers);

    return this.eventHelper.buildEventResponse(event);
  }

  async updateEvent(userId: string, dto: UpdateEventDto, eventId: string) {
    const reqData = {
      ...dto,
      brandId: userId,
      eventId,
    };

    const rawData = this.eventClient.send({ method: "PUT", path: "/events" }, reqData).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    const event = await lastValueFrom(rawData);
    return this.eventHelper.buildEventResponse(event);
  }

  async getEvents(user: ICurrentUser, offset: number, limit: number) {
    const reqData = { user, offset, limit };

    const rawData = this.eventClient.send({ method: "GET", path: "/events" }, reqData).pipe(
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

  async getEventById(user: ICurrentUser, id: string) {
    const reqData = { user, id };

    const rawData = this.eventClient.send({ method: "GET", path: "/events/:id" }, reqData).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    const event = await lastValueFrom(rawData);
    return this.eventHelper.buildEventResponse(event);
  }

  async assignVoucherInEvent(accountId: string, data: AddVoucherToAccountDto) {
    const { eventVoucherId, quantity } = data;
    const rawData = this.voucherClient
      .send({ method: "POST", path: "/vouchers/assigning" }, { accountId, eventVoucherId, quantity })
      .pipe(
        catchError((error) => {
          const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
          const message = error.message || "An error occurred";
          throw new HttpException(message, statusCode);
        })
      );

    return lastValueFrom(rawData);
  }

  async deleteVouchersInEvent(eventId: string, data: DeleteVoucherDto) {
    const rawData = this.voucherClient.send({ method: "DELETE", path: "/vouchers" }, { eventId, ...data }).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    return lastValueFrom(rawData);
  }

  async getVouchersInEvent(eventId: string) {
    const rawData = this.voucherClient.send({ method: "GET", path: "/vouchers/:eventId" }, { eventId }).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );
    return lastValueFrom(rawData);
  }

  async getItemsInEvent(eventId: string) {
    const rawData = this.itemClient.send({ method: "GET", path: "/items/:eventId" }, { eventId }).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );
    return lastValueFrom(rawData);
  }

  async createItemsInEvent(eventId: string, data: CreateItemDto) {
    const reqData = {
      eventId,
      ...data,
    };
    const rawData = this.itemClient.send({ method: "POST", path: "/items" }, reqData).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );
    return lastValueFrom(rawData);
  }

  async updateItemDetail(itemId: string, data: UpdateItemDto) {
    const reqData = {
      ...data,
      itemId,
    };
    const rawData = this.itemClient.send({ method: "PUT", path: "/items/:itemId" }, reqData).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );
    return lastValueFrom(rawData);
  }

  async deleteItemInEvent(itemId: string) {
    const rawData = this.itemClient.send({ method: "DELETE", path: "/items/:itemId" }, { itemId }).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    return lastValueFrom(rawData);
  }

  async getRecipesInEvent(eventId: string) {
    return this.itemClient.send({ method: "GET", path: "/events/:eventId/recipes" }, { eventId });
  }
}
