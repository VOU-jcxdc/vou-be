import { IsMongoId } from "class-validator";

export class CreateCombineItemDto {
  @IsMongoId()
  id: string;
}
