import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { ITEM_SERVICE_PROVIDER_NAME } from "@types";
import { catchError, lastValueFrom } from "rxjs";
import { RecipeHelper } from "./recipe.helper";

@Injectable()
export class ItemService {
  private itemClient: ClientProxy;

  constructor(
    @Inject(ITEM_SERVICE_PROVIDER_NAME) itemOptions: ClientOptions,
    private readonly recipeHelper: RecipeHelper
  ) {
    this.itemClient = ClientProxyFactory.create(itemOptions);
  }

  async getCraftableRecipesForItem(id: string) {
    const rawResponse = this.itemClient.send({ method: "GET", path: "/items/:id/recipes" }, { id }).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    const response = await lastValueFrom(rawResponse);

    return Promise.all(
      response.map(async (recipe: any) => {
        return this.recipeHelper.buildReponseData(recipe);
      })
    );
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
