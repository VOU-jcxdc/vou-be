import { IsNumber } from "class-validator";
import { SendGiftDto } from "./send-gift.dto";

export class CreateGiftRequestDto extends SendGiftDto {
  @IsNumber({ allowInfinity: false }, { message: "Quantity must be an integer" })
  quantity: number;
}
