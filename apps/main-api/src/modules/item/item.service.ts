import { Inject, Injectable } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { ITEM_SERVICE_PROVIDER_NAME } from "@types";

@Injectable()
export class ItemService {
  private itemClient: ClientProxy;

  constructor(@Inject(ITEM_SERVICE_PROVIDER_NAME) itemOptions: ClientOptions) {
    this.itemClient = ClientProxyFactory.create(itemOptions);
  }

  getCraftableRecipesForItem(id: string) {
    return this.itemClient.send({ method: "GET", path: "/items/:id/recipes" }, { id });
  }
}
