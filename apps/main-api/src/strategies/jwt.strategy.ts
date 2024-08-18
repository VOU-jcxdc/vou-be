import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  /* eslint-disable @typescript-eslint/no-explicit-any */
  async validate(payload: any) {
    return { userId: payload.userId, role: payload.role };
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
