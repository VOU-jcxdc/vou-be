import { IsNumber, IsOptional, IsUUID } from "class-validator";

export class AddConfigsDto {
  @IsOptional()
  @IsUUID(4, { message: "Invalid UUID" })
  eventId: string;

  @IsNumber({ allowInfinity: false }, { message: "Invalid number" })
  configs: number;
}
