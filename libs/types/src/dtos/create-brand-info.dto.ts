import { Type } from "class-transformer";
import { IsLatitude, IsLongitude, IsNotEmpty, ValidateNested } from "class-validator";

class LocationDto {
  @IsLongitude({ message: "Longtitude is invalid" })
  lng: number;

  @IsLatitude({ message: "Latitude is invalid" })
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
