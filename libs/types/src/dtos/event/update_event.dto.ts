import { PartialType } from "@nestjs/mapped-types";
import { CreateEventDto } from "./create_event.dto";
import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { EventStatusEnum } from "../../enums/event-status.enum";

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @IsOptional()
  @IsEnum(EventStatusEnum, {
    message: `status must be one of the following values: ${Object.values(EventStatusEnum).join(", ")}`,
  })
  status: EventStatusEnum;
}
