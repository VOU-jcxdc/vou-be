import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientOptions, Transport } from "@nestjs/microservices";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "../../strategies";

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get("JWT_EXPIRES_IN"),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: "USER_SERVICE",
      useFactory: (configService: ConfigService): ClientOptions => ({
        transport: Transport.TCP,
        options: {
          host: configService.get("USER_SERVICE_HOST"),
          port: configService.get("USER_SERVICE_PORT"),
        },
      }),
      inject: [ConfigService],
    },
    AuthService,
    JwtStrategy,
  ],
})
export class AuthModule {}
