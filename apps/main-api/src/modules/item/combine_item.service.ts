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

@Injectable()
export class CombineItemService {
  private itemClient: ClientProxy;
  private voucherClient: ClientProxy;

  constructor(
    @Inject(ITEM_SERVICE_PROVIDER_NAME) itemOptions: ClientOptions,
    @Inject(VOUCHER_SERVICE_PROVIDER_NAME) voucherOptions: ClientOptions
  ) {
    this.itemClient = ClientProxyFactory.create(itemOptions);
    this.voucherClient = ClientProxyFactory.create(voucherOptions);
  }

  async createRecipe(dto: CreateRecipeDto) {
    // Check target item is craftable
    const req = { itemId: dto.targetId, voucherId: dto.targetId, quantity: 1 };
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

    const rawItemResponse = this.itemClient.send({ method: "POST", path: "/recipes" }, dto).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    const itemResponse = await lastValueFrom(rawItemResponse);

    if (itemResponse.targetType === CombineItemTypeEnum.VOUCHER) {
      const rawVoucherResponse = this.voucherClient
        .send({ method: "GET", path: "/vouchers/:id" }, { voucherId: dto.targetId })
        .pipe(
          catchError((error) => {
            const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
            const message = error.message || "An error occurred";
            throw new HttpException(message, statusCode);
          })
        );

      const voucherResponse = await lastValueFrom(rawVoucherResponse);

      return {
        ...itemResponse,
        voucher: {
          id: voucherResponse.id,
          name: voucherResponse.name,
        },
      };
    }

    return itemResponse;
  }

  updateRecipe(id: string, dto: UpdateRecipeDto) {
    return this.itemClient.send({ method: "PUT", path: "/recipes" }, { id, ...dto });
  }

  getRecipe(id: string) {
    return this.itemClient.send({ method: "GET", path: "/recipes/:id" }, { id });
  }

  deleteRecipe(id: string) {
    return this.itemClient.send({ method: "DELETE", path: "/recipes/:id" }, { id });
  }
}
