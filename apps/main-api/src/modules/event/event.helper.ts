import { BrandInfo, Event } from "@database";
import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { USER_SERVICE_PROVIDER_NAME } from "@types";
import { catchError, lastValueFrom } from "rxjs";

export class EventHelper {
  private userClient: ClientProxy;

  constructor(@Inject(USER_SERVICE_PROVIDER_NAME) userOptions: ClientOptions) {
    this.userClient = ClientProxyFactory.create(userOptions);
  }

  async buildEventResponse(event: Event & { images: string[] }) {
    const rawData = this.userClient.send({ method: "GET", path: "/account/:id" }, { id: event.brandId }).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    const returnData = await lastValueFrom(rawData);

    const { id, accountId, ...brandInfo } = returnData.info;
    const { brandId, ...restEvent } = event;

    return {
      ...restEvent,
      brandInfo: {
        ...brandInfo,
        bucketId: returnData.bucketId,
      },
    };
  }
}
