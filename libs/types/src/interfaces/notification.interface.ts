export interface INotification {
  content: string;
  accountId: string;
  notificationTokenId: string;
  data: object;
  isRead: boolean;
}
