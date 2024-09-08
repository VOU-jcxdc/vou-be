import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "../user/user.module";
import { BucketModule } from "../bucket/bucket.module";
import { AuthModule } from "../auth/auth.module";
import { EventModule } from "../event/event.module";
import { VoucherModule } from "../voucher/voucher.module";
import { ItemModule } from "../item/item.module";
import { NotificationModule } from "../notification/notification.module";
import { QuizgameModule } from "../quizgame/quizgame.module";
import { SocketModule } from "../socket/socket.module";
import { AIEndpointModule } from "../ai-endpoint/ai_endpoint.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    BucketModule,
    AuthModule,
    EventModule,
    VoucherModule,
    ItemModule,
    NotificationModule,
    QuizgameModule,
    SocketModule,
    QuizgameModule,
    AIEndpointModule,
  ],
})
export class AppModule {}
