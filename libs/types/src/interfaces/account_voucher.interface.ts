import { VoucherStatusEnum } from "../enums";
import { IVoucher } from "./voucher.interface";

export interface IAccountVoucher {
  id: string;
  accountId: string;
  voucherId: string;
  quantity: number;
  assigenedOn: Date;
  updatedOn: Date;
  status: VoucherStatusEnum;

  readonly voucher: IVoucher;
}
