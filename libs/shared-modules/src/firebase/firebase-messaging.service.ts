import { Inject, Injectable } from "@nestjs/common";
import { AppOptions, messaging } from "firebase-admin";
import { App, initializeApp } from "firebase-admin/app";

@Injectable()
export class FirebaseMessagingService {
  private readonly app: App;
  constructor(@Inject("FIREBASE_ADMIN_OPTIONS_TOKEN") readonly options: AppOptions) {
    this.app = initializeApp(options);
  }
  pushNotification(
    token: string,
    topic?: string,
    message?: { title: string; body: string },
    data?: { [key: string]: string }
  ) {
    try {
      return messaging().send({
        notification: message,
        token,
        data,
        topic,
      });
    } catch (error) {
      console.log(error);
      throw new Error("Unable to send notification");
    }
  }
}
