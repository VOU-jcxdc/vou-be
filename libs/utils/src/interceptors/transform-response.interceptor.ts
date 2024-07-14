import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { ISuccessResponse } from "@types";
import { isNil } from "lodash";
import { Observable, map } from "rxjs";

type DataType = { data?: any };

const transform = <T extends DataType>(rawData: T): ISuccessResponse<T> => {
  const response: ISuccessResponse<T> = {
    statusCode: HttpStatus.OK,
    message: HttpStatus[HttpStatus.OK],
    data: null,
  };

  if (rawData && isNil(rawData.data)) {
    response.data = rawData;
  } else {
    response.data = rawData?.data ?? null;
  }

  return response;
};

@Injectable()
export class TransformResponseInterceptor<T extends DataType> implements NestInterceptor<T, ISuccessResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ISuccessResponse<T>> {
    return next.handle().pipe(map((data) => transform(data)));
  }
}
