import { VoucherStatus, VoucherType } from "../enums";
import { IAccountVoucher } from "./account_voucher.interface";
import { IEventVoucher } from "./event_voucher.interface";

export interface IVoucher {
  id: string;
  name: string;
  code: string;
  description: string;
  value: number;
  duration: number;
  status: VoucherStatus;
  type: VoucherType;
  createdOn: Date;
  updatedOn: Date;

  // Relations
  readonly accountVoucher: IAccountVoucher[];
  readonly eventVoucher: IEventVoucher[];
}
