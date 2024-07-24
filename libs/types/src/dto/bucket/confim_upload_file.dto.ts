import { IsNotEmpty, IsString } from "class-validator";

export class ConfirmUploadDto {
  @IsString()
  id: string;

  @IsNotEmpty()
  password: string;
}
