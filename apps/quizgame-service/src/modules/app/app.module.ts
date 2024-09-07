import { Module } from "@nestjs/common";
import { QuestionModule } from "../question/question.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), QuestionModule],
})
export class AppModule {}
