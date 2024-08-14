import { GenderEnum } from "../../enums/gender.enum";
import { Transform } from "class-transformer";
import { IsDate, IsEnum, ValidateIf } from "class-validator";

export class CreatePlayerInfoDto {
  @ValidateIf((value) => value !== undefined)
  @IsEnum(GenderEnum, { message: "gender is required as male or female" })
  gender: GenderEnum;

  @ValidateIf((value) => value !== undefined)
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  dob: Date;
}
