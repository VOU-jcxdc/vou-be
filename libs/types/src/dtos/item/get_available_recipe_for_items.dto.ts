import { ArrayNotEmpty, IsArray, IsUUID } from "class-validator";

export class GetAvaibleRecipesForItemsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID("4", { each: true })
  items: string[];
}
