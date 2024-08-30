import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { ITEM_SERVICE_PROVIDER_NAME } from "@types";
import { catchError, lastValueFrom } from "rxjs";

@Injectable()
export class ItemService {
  private itemClient: ClientProxy;

  constructor(@Inject(ITEM_SERVICE_PROVIDER_NAME) itemOptions: ClientOptions) {
    this.itemClient = ClientProxyFactory.create(itemOptions);
  }

  getCraftableRecipesForItem(id: string) {
    return this.itemClient.send({ method: "GET", path: "/items/:id/recipes" }, { id });
  }

  async getPlayerItems(accountId: string) {
    const rawData = this.itemClient.send({ method: "GET", path: "/items/my-items" }, { accountId }).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    return lastValueFrom(rawData);
  }
}
