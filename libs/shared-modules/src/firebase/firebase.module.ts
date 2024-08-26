import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppOptions, cert } from "firebase-admin/app";

import { FirebaseMessagingService } from "./firebase-messaging.service";

@Module({
  providers: [
    {
      provide: "FIREBASE_ADMIN_OPTIONS_TOKEN",
      inject: [ConfigService],
      useFactory: (configService: ConfigService): AppOptions => ({
        credential: cert({
          projectId: configService.get("FIREBASE_ADMIN_PROJECT_ID"),
          privateKey: configService.get("FIREBASE_ADMIN_PRIVATE_KEY"),
          clientEmail: configService.get("FIREBASE_ADMIN_CLIENT_EMAIL"),
        }),
      }),
    },
    FirebaseMessagingService,
  ],
  exports: [FirebaseMessagingService],
})
export class FirebaseModule {}
