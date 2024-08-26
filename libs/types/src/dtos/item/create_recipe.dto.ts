import { IsEnum, IsNumber, IsUUID, ValidateNested } from "class-validator";
import { IItemRecipe } from "../../interfaces";
import { Type } from "class-transformer";
import { CombineItemTypeEnum } from "../../enums";

class ItemRecipe {
  @IsUUID()
  itemId: string;

  @IsNumber()
  quantity: number;
}

export class CreateRecipeDto {
  @IsUUID()
  eventId: string;

  @ValidateNested({ each: true })
  @Type(() => ItemRecipe)
  itemRecipe: IItemRecipe[];

  @IsEnum(CombineItemTypeEnum, {
    message: `status must be one of the following values: ${Object.values(CombineItemTypeEnum).join(", ")}`,
  })
  targetType: CombineItemTypeEnum;

  @IsUUID()
  targetId: string;
}
