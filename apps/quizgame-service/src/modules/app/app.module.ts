import { Module } from "@nestjs/common";
import { ParserModule } from "../parser/parser.module";
import { ConfigModule } from "@nestjs/config";
import { QuizgameConfigModule } from "../config/config.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ParserModule, QuizgameConfigModule],
})
export class AppModule {}
