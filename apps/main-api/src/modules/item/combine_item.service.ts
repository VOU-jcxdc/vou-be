import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateCombineItemDto, ICurrentUser, ITEM_SERVICE_PROVIDER_NAME } from "@types";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { catchError, lastValueFrom } from "rxjs";

@Injectable()
export class CombineItemService {
  private itemClient: ClientProxy;

  constructor(@Inject(ITEM_SERVICE_PROVIDER_NAME) itemOptions: ClientOptions) {
    this.itemClient = ClientProxyFactory.create(itemOptions);
  }

  async combineItems(user: ICurrentUser, dto: CreateCombineItemDto) {
    const rawItemHandler = this.itemClient
      .send({ method: "POST", path: "/items/combine-items" }, { userId: user.userId, ...dto })
      .pipe(
        catchError((error) => {
          const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
          const message = error.message || "An error occurred";
          throw new HttpException(message, statusCode);
        })
      );

    const itemHandler = await lastValueFrom(rawItemHandler);

    return itemHandler;
  }
}
