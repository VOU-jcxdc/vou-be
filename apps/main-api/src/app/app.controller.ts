import { Controller, Get } from "@nestjs/common";

import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("response")
  getData() {
    return this.appService.getData();
  }

  @Get("error")
  getError() {
    return this.appService.getError();
  }
}
