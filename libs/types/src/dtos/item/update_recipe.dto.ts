import { PartialType } from "@nestjs/mapped-types";
import { CreateRecipeDto } from "./create_recipe.dto";

export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {}
