import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: "Hello API" };
  }

  getError(): { message: string } {
    throw new Error("Error");
  }
}
