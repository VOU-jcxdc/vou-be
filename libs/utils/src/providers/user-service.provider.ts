import { ConfigService } from "@nestjs/config";
import { USER_SERVICE_PROVIDER_NAME, IServiceProvider } from "@types";
import { ClientOptions, Transport } from "@nestjs/microservices";

export const userServiceProvider: IServiceProvider = {
  provide: USER_SERVICE_PROVIDER_NAME,
  useFactory: (configService: ConfigService): ClientOptions => ({
    transport: Transport.TCP,
    options: {
      host: configService.get("USER_SERVICE_HOST"),
      port: configService.get("USER_SERVICE_PORT"),
    },
  }),
  inject: [ConfigService],
};
