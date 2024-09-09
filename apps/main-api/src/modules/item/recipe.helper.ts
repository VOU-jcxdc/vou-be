import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { CombineItemTypeEnum, VOUCHER_SERVICE_PROVIDER_NAME } from "@types";
import { catchError, lastValueFrom } from "rxjs";

@Injectable()
export class RecipeHelper {
  private voucherClient: ClientProxy;

  constructor(@Inject(VOUCHER_SERVICE_PROVIDER_NAME) voucherOpts: ClientOptions) {
    this.voucherClient = ClientProxyFactory.create(voucherOpts);
  }

  async buildReponseData(response: any) {
    if (response.targetType === CombineItemTypeEnum.ITEM) return response;

    const rawVoucherResponse = this.voucherClient
      .send({ method: "GET", path: "/event-vouchers/:id" }, { voucherId: response.targetId })
      .pipe(
        catchError((error) => {
          const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
          const message = error.message || "An error occurred";
          throw new HttpException(message, statusCode);
        })
      );

    const voucherResponse = await lastValueFrom(rawVoucherResponse);

    return {
      ...response,
      target: {
        id: voucherResponse.id,
        name: voucherResponse.name,
      },
    };
  }
}
