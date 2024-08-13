import { ConfigService } from "@nestjs/config";
import { EVENT_SERVICE_PROVIDER_NAME, IServiceProvider } from "@types";
import { ClientOptions, Transport } from "@nestjs/microservices";

export const eventServierProvider: IServiceProvider = {
  provide: EVENT_SERVICE_PROVIDER_NAME,
  useFactory: (configService: ConfigService): ClientOptions => ({
    transport: Transport.TCP,
    options: {
      host: configService.get("EVENT_SERVICE_HOST"),
      port: configService.get("EVENT_SERVICE_PORT"),
    },
  }),
  inject: [ConfigService],
};
