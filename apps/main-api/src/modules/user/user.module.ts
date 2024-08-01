import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { ConfigModule } from "@nestjs/config";
import { AdminController } from "./admin.controller";
import { ClientProxyModule } from "@shared-modules";

@Module({
  imports: [ConfigModule, ClientProxyModule],
  controllers: [UserController, AdminController],
  providers: [UserService],
})
export class UserModule {}
