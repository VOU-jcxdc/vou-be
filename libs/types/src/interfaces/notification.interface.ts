export interface INotification {
  title: string;
  content: string;
  accountId: string;
  notificationTokenId: string;
  data: object;
  isRead: boolean;
}
