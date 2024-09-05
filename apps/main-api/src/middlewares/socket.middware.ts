import { JwtService } from "@nestjs/jwt";
import { ISocketClient, ISocketMiddleware } from "@types";

export const WSAuthMiddleware = (jwtService: JwtService): ISocketMiddleware => {
  return async (socket: ISocketClient, next) => {
    try {
      const token = socket.handshake.headers.authorization.split(" ")[0];
      const player = await jwtService.verify(token);
      socket.player = player;
      next();
    } catch (error) {
      next({
        name: "Unauthorizaed",
        message: "Unauthorizaed",
      });
    }
  };
};
