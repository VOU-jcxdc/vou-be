import { IsDateString, IsString, IsUUID } from "class-validator";

export class CreateEventDto {
  @IsString()
  name: string;

  @IsUUID()
  image: string;

  @IsDateString()
  beginDate: Date;

  @IsDateString()
  endDate: Date;
}
