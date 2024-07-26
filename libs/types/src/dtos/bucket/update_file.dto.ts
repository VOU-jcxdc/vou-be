import { IsString, IsUUID } from "class-validator";

export class UpdateFileDto {
  @IsUUID()
  id: string;

  @IsString()
  filename: string;
}
