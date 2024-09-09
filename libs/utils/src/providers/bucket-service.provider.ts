import { ConfigService } from "@nestjs/config";
import { BUCKET_SERVICE_PROVIDER_NAME, IServiceProvider } from "@types";
import { ClientOptions, Transport } from "@nestjs/microservices";

export const bucketServiceProvider: IServiceProvider = {
  provide: BUCKET_SERVICE_PROVIDER_NAME,
  useFactory: (configService: ConfigService): ClientOptions => ({
    transport: Transport.TCP,
    options: {
      host: configService.get("BUCKET_SERVICE_HOST"),
      port: configService.get("BUCKET_SERVICE_PORT_LB"),
    },
  }),
  inject: [ConfigService],
};
