import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ICurrentUser } from "@types";

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext): ICurrentUser => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
