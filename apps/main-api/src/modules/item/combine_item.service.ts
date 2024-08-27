import { Inject, Injectable } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { CreateRecipeDto, GetAvaibleRecipesForItemsDto, ITEM_SERVICE_PROVIDER_NAME, UpdateRecipeDto } from "@types";

@Injectable()
export class CombineItemService {
  private itemClient: ClientProxy;

  constructor(@Inject(ITEM_SERVICE_PROVIDER_NAME) itemOptions: ClientOptions) {
    this.itemClient = ClientProxyFactory.create(itemOptions);
  }

  createRecipe(dto: CreateRecipeDto) {
    return this.itemClient.send({ method: "POST", path: "/recipes" }, dto);
  }

  updateRecipe(id: string, dto: UpdateRecipeDto) {
    return this.itemClient.send({ method: "PUT", path: "/recipes" }, { id, ...dto });
  }

  getRecipe(id: string) {
    return this.itemClient.send({ method: "GET", path: "/recipes/:id" }, { id });
  }

  getAvaibleRecipesForItems(dto: GetAvaibleRecipesForItemsDto) {
    return this.itemClient.send({ method: "POST", path: "/recipes/available-for-items" }, dto);
  }

  deleteRecipe(id: string) {
    return this.itemClient.send({ method: "DELETE", path: "/recipes/:id" }, { id });
  }
}
