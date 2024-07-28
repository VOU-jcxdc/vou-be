import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { ClientOptions, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AdminController } from "./admin.controller";

@Module({
  imports: [ConfigModule],
  controllers: [UserController, AdminController],
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
    UserService,
  ],
})
export class UserModule {}
