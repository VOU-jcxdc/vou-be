import { IsEnum, IsNumber, IsNotEmpty, IsUUID, ValidateNested } from "class-validator";
import { ItemTypeEnum } from "../../enums";
import { Type } from "class-transformer";

export class ItemDetailDto {
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

export class CreateItemDto {
  @ValidateNested({ each: true })
  @Type(() => ItemDetailDto)
  items: ItemDetailDto[];
}
