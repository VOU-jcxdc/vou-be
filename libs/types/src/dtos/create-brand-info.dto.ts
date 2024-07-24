import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";

class LocationDto {
  @IsNotEmpty({ message: "Lng is required" })
  lng: number;

  @IsNotEmpty({ message: "Lat is required" })
  lat: number;
}

export class CreateBrandInfoDto {
  @IsNotEmpty({ message: "Field is required as brand" })
  field: string;

  @IsNotEmpty({ message: "Address is required as brand" })
  address: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsNotEmpty({ message: "Name is required as brand" })
  name: string;
}
