import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { catchError, lastValueFrom } from "rxjs";
import { BUCKET_SERVICE_PROVIDER_NAME, ConfirmUploadDto, UpdateFileDto, UploadFileDto } from "@types";

@Injectable()
export class BucketService {
  private client: ClientProxy;

  constructor(@Inject(BUCKET_SERVICE_PROVIDER_NAME) private readonly options: ClientOptions) {
    this.client = ClientProxyFactory.create(options);
  }

  async getPresignedUploadUrl(body: UploadFileDto): Promise<string> {
    const rawData = this.client.send({ method: "POST", path: "/files/presigned-url" }, body).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );
    const data = await lastValueFrom(rawData);
    return data;
  }

  async getPresignedDownloadUrl(id: string): Promise<string> {
    const rawData = this.client.send({ method: "GET", path: "/files/:id" }, id).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );
    const data = await lastValueFrom(rawData);
    return data;
  }

  async deleteFile(id: string): Promise<{ affected: number }> {
    const data = this.client.send({ method: "DELETE", path: "/files/:id" }, id).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );
    return await lastValueFrom(data);
  }

  async getPresignedUploadUrlForUpdate(id: string, body: UpdateFileDto) {
    const rawData = this.client.send({ method: "PUT", path: "/files/presigned-url/:id" }, { id, ...body }).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );
    const data = await lastValueFrom(rawData);
    return data;
  }

  async confimUpload(body: ConfirmUploadDto): Promise<string> {
    const rawData = this.client.send({ method: "POST", path: "/files/upload-confirmation" }, body).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );
    const data = await lastValueFrom(rawData);
    return data;
  }
}
