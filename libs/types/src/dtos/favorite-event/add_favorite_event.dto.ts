import { IsUUID } from "class-validator";

export class AddFavoriteEventDto {
  @IsUUID()
  eventId: string;
}
