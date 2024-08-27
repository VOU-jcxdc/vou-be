import { IsUUID } from "class-validator";

export class DeleteItemsDto {
  @IsUUID(4, { each: true, message: "itemIds must be a valid UUID" })
  itemIds: string[];
}
