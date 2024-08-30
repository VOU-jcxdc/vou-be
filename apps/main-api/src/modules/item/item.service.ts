import { Inject, Injectable } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { CreateItemDto, EVENT_SERVICE_PROVIDER_NAME, ITEM_SERVICE_PROVIDER_NAME } from "@types";

@Injectable()
export class ItemService {
  private eventClient: ClientProxy;
  private itemClient: ClientProxy;

  constructor(
    @Inject(ITEM_SERVICE_PROVIDER_NAME) itemOptions: ClientOptions,
    @Inject(EVENT_SERVICE_PROVIDER_NAME) eventOptions: ClientOptions
  ) {
    this.eventClient = ClientProxyFactory.create(eventOptions);
    this.itemClient = ClientProxyFactory.create(itemOptions);
  }

  getCraftableRecipesForItem(id: string) {
    return this.itemClient.send({ method: "GET", path: "/items/:id/recipes" }, { id });
  }

  async getItemsByEventId(eventId: string) {
    return this.itemClient.send({ method: "GET", path: "/items/:eventId" }, { eventId });
  }
  async createItems(data: CreateItemDto) {
    // const event = this.eventClient.send({ method: "GET", path: "/events/:id"}, {})
    return this.itemClient.send({ method: "POST", path: "/items" }, data);
  }
}
