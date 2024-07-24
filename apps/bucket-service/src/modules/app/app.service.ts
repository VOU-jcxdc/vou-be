import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectS3, S3 } from "nestjs-s3";
import { BucketRepository } from "../repository/bucket.repository";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { ConfirmUploadDto, UpdateFileDto, UploadFileDto, UploadStatusEnum } from "@types";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {
  private bucketName: string = "";

  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly bucketRepository: BucketRepository,
    private readonly configService: ConfigService
  ) {
    this.bucketName = this.configService.get("BUCKET_NAME");
  }

  async getPresignedUploadUrl(body: UploadFileDto): Promise<{ id: string; url: string }> {
    try {
      const { filename } = body;
      const data = await this.bucketRepository.create({
        filename,
      });
      const command = new PutObjectCommand({ Bucket: this.bucketName, Key: `${data.id}` });
      return {
        id: data.id,
        url: await getSignedUrl(this.s3, command, { expiresIn: 3600 }),
      };
    } catch (_: unknown) {
      throw new InternalServerErrorException();
    }
  }

  async getPresignedDownloadUrl(id: string): Promise<string> {
    try {
      const data = await this.bucketRepository.findOne({ where: { id } });

      if (!data || data.uploadStatus === UploadStatusEnum.PENDING) {
        throw new InternalServerErrorException("File not found");
      }

      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: id,
        ResponseContentDisposition: `inline; filename=${data.filename}`,
      });

      return await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    } catch (_: unknown) {
      throw new InternalServerErrorException();
    }
  }

  async deleteFile(id: string): Promise<{ affected: number }> {
    try {
      const data = await this.bucketRepository.delete({ id });
      if (data.affected) {
        const command = new DeleteObjectCommand({ Bucket: this.bucketName, Key: id });
        await this.s3.send(command);
      }

      return { affected: data.affected };
    } catch (_: unknown) {
      throw new InternalServerErrorException();
    }
  }

  async getPresignedUploadUrlForUpdate(body: UpdateFileDto): Promise<{ id: string; url: string }> {
    try {
      const { id, filename } = body;
      const data = await this.bucketRepository.findOne({ where: { id } });

      if (!data) {
        throw new InternalServerErrorException();
      }

      data.filename = filename;
      await this.bucketRepository.save(data);

      const command = new PutObjectCommand({ Bucket: this.bucketName, Key: id });
      return {
        id: data.id,
        url: await getSignedUrl(this.s3, command, { expiresIn: 3600 }),
      };
    } catch (_: unknown) {
      throw new InternalServerErrorException();
    }
  }

  async confimUpload(body: ConfirmUploadDto): Promise<string> {
    try {
      const data = await this.bucketRepository.findOne({ where: { id: body.id } });

      if (!data) {
        throw new InternalServerErrorException();
      }

      const command = new HeadObjectCommand({ Bucket: this.bucketName, Key: data.id });
      await this.s3.send(command);

      data.uploadStatus = UploadStatusEnum.UPLOADED;
      await this.bucketRepository.save(data);

      return "OK";
    } catch (_: unknown) {
      throw new InternalServerErrorException();
    }
  }
}
