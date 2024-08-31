import { PartialType } from "@nestjs/mapped-types";
import { ItemDetailDto } from "./create-item.dto";

export class UpdateItemDto extends PartialType(ItemDetailDto) {}
