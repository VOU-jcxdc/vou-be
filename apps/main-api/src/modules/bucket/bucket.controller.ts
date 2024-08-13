import { Body, Controller, Delete, Get, Param, Post, Put, Redirect } from "@nestjs/common";
import { BucketService } from "./bucket.service";
import { BypassTransformResponse } from "@utils";
import { ConfirmUploadDto, UpdateFileDto, UploadFileDto } from "@types";

@Controller("files")
export class BucketController {
  constructor(private readonly bucketService: BucketService) {}

  @Post("presigned-url")
  async getPresignedUploadUrl(@Body() dto: UploadFileDto) {
    return await this.bucketService.getPresignedUploadUrl(dto);
  }

  @Get(":id")
  @Redirect()
  @BypassTransformResponse()
  async getPresignedDownloadUrl(@Param("id") id: string) {
    return { url: await this.bucketService.getPresignedDownloadUrl(id) };
  }

  @Delete(":id")
  async deleteFile(@Param("id") id: string): Promise<{ affected: number }> {
    return await this.bucketService.deleteFile(id);
  }

  @Put("presigned-url/:id")
  async getPresignedUploadUrlForUpdate(@Body() dto: UpdateFileDto, @Param("id") id: string) {
    return await this.bucketService.getPresignedUploadUrlForUpdate(id, dto);
  }

  @Post("upload-confirmation")
  async confimUpload(@Body() dto: ConfirmUploadDto) {
    return await this.bucketService.confimUpload(dto);
  }
}
