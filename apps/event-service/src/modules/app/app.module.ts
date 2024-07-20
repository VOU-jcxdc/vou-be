import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventModule } from "../event/event.module";
import { PostgreDatabaseModule } from "@database";

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), EventModule, PostgreDatabaseModule],
    controllers: [],
    providers: [],
})
export class AppModule {}