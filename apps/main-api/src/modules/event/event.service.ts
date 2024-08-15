import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import {
  AddVoucherToAccountDto,
  CreateEventDto,
  DeleteVoucherDto,
  EVENT_SERVICE_PROVIDER_NAME,
  ICurrentUser,
  UpdateEventDto,
  VOUCHER_SERVICE_PROVIDER_NAME,
} from "@types";
import { catchError, lastValueFrom } from "rxjs";

@Injectable()
export class EventService {
  private client: ClientProxy;
  private clientVoucher: ClientProxy;

  constructor(
    @Inject(EVENT_SERVICE_PROVIDER_NAME) eventOptions: ClientOptions,
    @Inject(VOUCHER_SERVICE_PROVIDER_NAME) voucherOptions: ClientOptions
  ) {
    this.client = ClientProxyFactory.create(eventOptions);
    this.clientVoucher = ClientProxyFactory.create(voucherOptions);
  }

  async createEvent(userId: string, dto: CreateEventDto) {
    const reqData = {
      ...dto,
      brandId: userId,
      vouchers: undefined,
    };

    const rawData = this.client.send({ method: "POST", path: "/events" }, reqData).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    const event = await lastValueFrom(rawData);

    const rawVouchers = this.clientVoucher
      .send({ method: "POST", path: "/vouchers" }, { eventId: event.id, brandId: userId, vouchers: dto.vouchers })
      .pipe(
        catchError((error) => {
          const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
          const message = error.message || "An error occurred";
          throw new HttpException(message, statusCode);
        })
      );

    await lastValueFrom(rawVouchers);

    return event;
  }

  async updateEvent(userId: string, dto: UpdateEventDto, eventId: string) {
    const reqData = {
      ...dto,
      brandId: userId,
      eventId,
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

  async assignVoucherInEvent(accountId: string, data: AddVoucherToAccountDto) {
    const { eventVoucherId, quantity } = data;
    const rawData = this.clientVoucher
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
    const rawData = this.clientVoucher.send({ method: "DELETE", path: "/vouchers" }, { eventId, ...data }).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    return lastValueFrom(rawData);
  }

  async getVouchersInEvent(eventId: string) {
    const rawData = this.clientVoucher.send({ method: "GET", path: "/vouchers/:eventId" }, { eventId }).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    return lastValueFrom(rawData);
  }
}
