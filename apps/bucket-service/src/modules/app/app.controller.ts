import { Controller } from "@nestjs/common";

import { AppService } from "./app.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ConfirmUploadDto, UpdateFileDto, UploadFileDto } from "@types";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ method: "POST", path: "/files/presigned-url" })
  async getUploadPresignedUrl(@Payload() body: UploadFileDto): Promise<{ id: string; url: string }> {
    return await this.appService.getPresignedUploadUrl(body);
  }

  @MessagePattern({ method: "GET", path: "/files/:id" })
  async getPresignedDownloadUrl(@Payload() id: string): Promise<string> {
    return await this.appService.getPresignedDownloadUrl(id);
  }

  @MessagePattern({ method: "DELETE", path: "/files/:id" })
  async deleteFile(@Payload() id: string): Promise<{ affected: number }> {
    return await this.appService.deleteFile(id);
  }

  @MessagePattern({ method: "PUT", path: "/files/presigned-url" })
  async updatePresignedUploadUrl(@Payload() body: UpdateFileDto): Promise<{ id: string; url: string }> {
    return await this.appService.getPresignedUploadUrlForUpdate(body);
  }

  @MessagePattern({ method: "POST", path: "/files/upload-confirmation" })
  async confirmUpload(@Payload() body: ConfirmUploadDto): Promise<string> {
    return await this.appService.confimUpload(body);
  }
}
