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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AccountController],
  providers: [AccountService, AccountHelper],
})
export class AccountModule {}
