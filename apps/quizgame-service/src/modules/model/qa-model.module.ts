import { Module } from "@nestjs/common";
import { QAModel } from "./qa.model";
import { MongooseModule } from "@nestjs/mongoose";
import { MongoDatabaseModule, QAs, QASchema } from "@database";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QAs.name,
        schema: QASchema,
      },
    ]),
    MongoDatabaseModule,
  ],
  providers: [QAModel],
  exports: [QAModel],
})
export class QAModelModule {}
