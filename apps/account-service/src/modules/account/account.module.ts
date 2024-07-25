import { Module } from "@nestjs/common";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";
import { AccountRepositoryModule } from "../repository/account-repository.module";
import { AccountHelper } from "./account.helper";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    AccountRepositoryModule,
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
      }),
    }),
  ],
  controllers: [AccountController],
  providers: [AccountService, AccountHelper],
})
export class AccountModule {}
