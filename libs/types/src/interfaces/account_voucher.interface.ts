import { VoucherStatus } from "../enums";

export interface IAccountVoucher {
  id: string;
  accountId: string;
  voucherId: string;
  quantity: number;
  assigenedOn: Date;
  updatedOn: Date;
  status: VoucherStatus;
}
