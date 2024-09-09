import { MongoDatabaseModule, QARecord, QARecordSchema } from "@database";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { QARecordModel } from "./qa-record.model";

@Module({
  imports: [
    MongoDatabaseModule,
    MongooseModule.forFeature([
      {
        name: QARecord.name,
        schema: QARecordSchema,
      },
    ]),
  ],
  providers: [QARecordModel],
  exports: [QARecordModel],
})
export class QaRecordModelModule {}
