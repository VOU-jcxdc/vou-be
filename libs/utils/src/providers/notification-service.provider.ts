import { ConfigService } from "@nestjs/config";
import { NOTIFICATION_SERVICE_PROVIDER_NAME, IServiceProvider } from "@types";
import { ClientOptions, Transport } from "@nestjs/microservices";

export const notificationServiceProvider: IServiceProvider = {
  provide: NOTIFICATION_SERVICE_PROVIDER_NAME,
  useFactory: (configService: ConfigService): ClientOptions => ({
    transport: Transport.TCP,
    options: {
      host: configService.get("NOTIFICATION_SERVICE_HOST"),
      port: configService.get("NOTIFICATION_SERVICE_PORT_LB"),
    },
  }),
  inject: [ConfigService],
};
