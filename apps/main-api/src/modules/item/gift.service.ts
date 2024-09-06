import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { CreateGiftRequestDto, ITEM_SERVICE_PROVIDER_NAME, SendGiftDto, USER_SERVICE_PROVIDER_NAME } from "@types";
import { catchError, lastValueFrom } from "rxjs";

@Injectable()
export class GiftService {
  private client: ClientProxy;
  private userClient: ClientProxy;

  constructor(
    @Inject(ITEM_SERVICE_PROVIDER_NAME) itemOptions: ClientOptions,
    @Inject(USER_SERVICE_PROVIDER_NAME) userOptions: ClientOptions
  ) {
    this.client = ClientProxyFactory.create(itemOptions);
    this.userClient = ClientProxyFactory.create(userOptions);
  }

  async getReceivedRequests(receiverId: string) {
    const rawData = this.client
      .send({ method: "GET", path: "gifts/received-requests/:receiverId" }, { receiverId })
      .pipe(
        catchError((error) => {
          const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
          const message = error.message || "An error occurred";
          throw new HttpException(message, statusCode);
        })
      );

    return lastValueFrom(rawData);
  }

  async getSentRequests(senderId: string) {
    const rawData = this.client.send({ method: "GET", path: "gifts/sent-requests/:senderId" }, { senderId }).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    return lastValueFrom(rawData);
  }

  async createGiftRequest(data: CreateGiftRequestDto) {
    const rawData = this.client.send({ method: "POST", path: "gifts" }, data).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    return lastValueFrom(rawData);
  }

  async acceptGiftRequest(giftId: string, accountId: string) {
    const rawData = this.client.send({ method: "PUT", path: "gifts/:giftId" }, { giftId, accountId }).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    return lastValueFrom(rawData);
  }

  async rejectGiftRequest(giftId: string, accountId: string) {
    const rawData = this.client.send({ method: "DELETE", path: "gifts/:giftId" }, { giftId, accountId }).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    return lastValueFrom(rawData);
  }

  async sendGift(data: SendGiftDto) {
    const rawData = this.client.send({ method: "POST", path: "gifts/sending" }, data).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    return lastValueFrom(rawData);
  }
}
