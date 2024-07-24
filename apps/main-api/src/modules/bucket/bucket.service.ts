import { Inject, Injectable } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { ConfirmUploadDto, UpdateFileDto, UploadFileDto } from "@types";

@Injectable()
export class BucketService {
  private client: ClientProxy;

  constructor(@Inject("BUCKET_SERVICE") private readonly options: ClientOptions) {
    this.client = ClientProxyFactory.create(options);
  }

  async getPresignedUploadUrl(body: UploadFileDto): Promise<string> {
    const rawData = this.client.send({ method: "POST", path: "/files/presigned-url" }, body);
    const data = await lastValueFrom(rawData);
    return data;
  }

  async getPresignedDownloadUrl(id: string): Promise<string> {
    const rawData = this.client.send({ method: "GET", path: "/files/:id" }, id);
    const data = await lastValueFrom(rawData);
    return data;
  }

  async deleteFile(id: string): Promise<{ affected: number }> {
    const data = this.client.send({ method: "DELETE", path: "/files/:id" }, id);
    return await lastValueFrom(data);
  }

  async getPresignedUploadUrlForUpdate(body: UpdateFileDto): Promise<string> {
    const rawData = this.client.send({ method: "PUT", path: "/files/presigned-url" }, body);
    const data = await lastValueFrom(rawData);
    return data;
  }

  async confimUpload(body: ConfirmUploadDto): Promise<string> {
    const rawData = this.client.send({ method: "POST", path: "/files/upload-confirmation" }, body);
    const data = await lastValueFrom(rawData);
    return data;
  }
}
