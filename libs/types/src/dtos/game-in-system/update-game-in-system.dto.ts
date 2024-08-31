import { IsBoolean, IsNotEmpty } from "class-validator";

export class UpdateGameInSystemDto {
  @IsBoolean({ message: "exchangeStatus must be a boolean" })
  exchangeStatus: boolean;

  @IsNotEmpty({ message: "instruction can not be empty" })
  instruction: string;
}
