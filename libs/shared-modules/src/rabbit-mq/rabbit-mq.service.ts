import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { RMQ_PROVIDER } from "@types";

@Injectable()
export class RabbitMqService implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(RMQ_PROVIDER) private client: ClientProxy) {}

  async onModuleInit() {
    try {
      await this.client.connect();
      this.client.emit<any>("testEvent", "Test message").subscribe({
        next: (val) => console.log(`next: ${val}`),
        error: (err) => console.log(`error: ${err}`),
        complete: () => console.log("complete"),
      });
    } catch (error) {
      console.error(error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.client.close();
    } catch (error) {
      console.error(error);
    }
  }
}
