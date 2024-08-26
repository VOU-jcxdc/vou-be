import { IsNotEmpty } from "class-validator";

export class UpsertFcmTokenDto {
  @IsNotEmpty({ message: "Token is required" })
  token: string;
}
