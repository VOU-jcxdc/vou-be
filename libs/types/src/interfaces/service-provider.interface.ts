import { ConfigService } from "@nestjs/config";
import { ClientOptions } from "@nestjs/microservices";

export interface IServiceProvider {
  provide: string;
  useFactory: (configService: ConfigService) => ClientOptions;
  inject: any[];
}
