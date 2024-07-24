import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { ClientOptions, Transport } from "@nestjs/microservices";

@Module({
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
  ],
})
export class AuthModule {}
