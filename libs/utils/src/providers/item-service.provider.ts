import { ConfigService } from "@nestjs/config";
import { ITEM_SERVICE_PROVIDER_NAME, IServiceProvider } from "@types";
import { ClientOptions, Transport } from "@nestjs/microservices";

export const itemServiceProvider: IServiceProvider = {
  provide: ITEM_SERVICE_PROVIDER_NAME,
  useFactory: (configService: ConfigService): ClientOptions => ({
    transport: Transport.TCP,
    options: {
      host: configService.get("ITEM_SERVICE_HOST"),
      port: configService.get("ITEM_SERVICE_PORT_LB"),
    },
  }),
  inject: [ConfigService],
};
