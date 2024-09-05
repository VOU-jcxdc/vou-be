import { IsInt, IsNegative, IsNumber, IsUUID, Max, ValidateIf } from "class-validator";

export class ValidateConfigsDto {
  @IsUUID(4, { message: "Invalid UUID" })
  eventId: string;

  @IsInt({ message: "Invalid number" })
  @Max(0, { message: "Value must be <= 0" })
  config: number;
}
