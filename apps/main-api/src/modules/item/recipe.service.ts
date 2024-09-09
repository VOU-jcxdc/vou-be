import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import {
  CombineItemTypeEnum,
  CreateRecipeDto,
  ITEM_SERVICE_PROVIDER_NAME,
  UpdateRecipeDto,
  VOUCHER_SERVICE_PROVIDER_NAME,
} from "@types";
import { catchError, lastValueFrom } from "rxjs";
import { RecipeHelper } from "./recipe.helper";

@Injectable()
export class RecipeService {
  private itemClient: ClientProxy;
  private voucherClient: ClientProxy;

  constructor(
    @Inject(ITEM_SERVICE_PROVIDER_NAME) itemOptions: ClientOptions,
    @Inject(VOUCHER_SERVICE_PROVIDER_NAME) voucherOptions: ClientOptions,
    private readonly recipeHelper: RecipeHelper
  ) {
    this.itemClient = ClientProxyFactory.create(itemOptions);
    this.voucherClient = ClientProxyFactory.create(voucherOptions);
  }

  async createRecipe(dto: CreateRecipeDto) {
    // Check target item is craftable
    const req = { itemId: dto.targetId, eventVoucherId: dto.targetId, quantity: 1 };
    const client = dto.targetType === CombineItemTypeEnum.ITEM ? this.itemClient : this.voucherClient;

    const rawIsCraftable = client.send({ method: "POST", path: "/craftable-validation" }, req).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    const isCraftable = await lastValueFrom(rawIsCraftable);

    if (!isCraftable) {
      throw new HttpException("Item not craftable", HttpStatus.BAD_REQUEST);
    }

    const rawResponse = this.itemClient.send({ method: "POST", path: "/recipes" }, dto).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    const response = await lastValueFrom(rawResponse);

    return this.recipeHelper.buildReponseData(response);
  }

  updateRecipe(id: string, dto: UpdateRecipeDto) {
    const rawResponse = this.itemClient.send({ method: "PUT", path: "/recipes" }, { id, ...dto }).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    const response = lastValueFrom(rawResponse);

    return this.recipeHelper.buildReponseData(response);
  }

  async getRecipe(id: string) {
    const rawResponse = this.itemClient.send({ method: "GET", path: "/recipes/:id" }, { id }).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    const response = await lastValueFrom(rawResponse);

    return this.recipeHelper.buildReponseData(response);
  }

  deleteRecipe(id: string) {
    return this.itemClient.send({ method: "DELETE", path: "/recipes/:id" }, { id });
  }
}
