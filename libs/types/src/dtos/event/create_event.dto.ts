import { IsDateString, IsString, IsUUID } from "class-validator";

export class CreateEventDto {
  @IsString()
  name: string;

  @IsUUID("4", { each: true })
  images: string[];

  @IsDateString()
  beginDate: Date;

  @IsDateString()
  endDate: Date;

  @IsString()
  description: string;
}
