import { IsEnum, IsNumber, IsNotEmpty, IsUUID } from "class-validator";
import { ItemTypeEnum } from "../../enums";

export class CreateItemDto {
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @IsUUID("4", { message: "image must be a valid UUID" })
  imageId: string;

  @IsUUID("4", { message: "Event must be a valid UUID" })
  eventId: string;

  @IsEnum(ItemTypeEnum)
  type: ItemTypeEnum;

  @IsNumber({ allowInfinity: false }, { message: "Quantity must be an integer" })
  quantity: number;
}
