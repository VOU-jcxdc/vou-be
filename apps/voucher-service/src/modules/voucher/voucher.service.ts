import { Injectable } from "@nestjs/common";
import { VoucherRepository } from "../repository/voucher.repository";
import { AssignVoucherDto, CreateVoucherDto, UpdateAsssignVoucherDto, UpdateVoucherDto, VoucherStatus } from "@types";
import { EventVoucherRepository } from "../repository/event-voucher.repository";
import { AccountVoucherRepository } from "../repository/account-voucher.repository";
import { isNil } from "lodash";

@Injectable()
export class VoucherService {
  constructor(
    private readonly voucherRepo: VoucherRepository,
    private readonly eventVoucherRepo: EventVoucherRepository,
    private readonly accountVoucherRepo: AccountVoucherRepository
  ) {}

  async createVouchers(data: CreateVoucherDto) {
    try {
      const { eventId, vouchers } = data;
      const savedVouchers = await this.voucherRepo.saveManyVouchers(vouchers);
      const eventVouchers = savedVouchers.map((voucher) => {
        return {
          eventId,
          voucherId: voucher.id,
          quantity: voucher.quantity,
        };
      });
      await this.eventVoucherRepo.saveMany(eventVouchers);
      return { eventId, vouchers: [...savedVouchers] };
    } catch (error) {
      throw error;
    }
  }

  async getVouchersByEventId(eventId: string) {
    try {
      return this.eventVoucherRepo.findAll({
        where: { eventId },
        relations: {
          voucher: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getVoucherById(voucherId: string) {
    try {
      return this.voucherRepo.findOne({
        where: { id: voucherId },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateVoucherDetail(voucherId: string, data: UpdateVoucherDto) {
    try {
      return this.voucherRepo.updateOne({ where: { id: voucherId } }, data);
    } catch (error) {
      throw error;
    }
  }

  async deleteVouchersInEvent(eventId: string, voucherIds: string[]) {
    try {
      return this.eventVoucherRepo.deleteVouchersInEvent(eventId, voucherIds);
    } catch (error) {
      throw error;
    }
  }

  async asignVoucherToAccount(voucherId: string, data: AssignVoucherDto) {
    try {
      // check if the voucher is in the event and has enough quantity
      const { eventId, quantity, accountId } = data;
      const voucherInEvent = await this.eventVoucherRepo.findOne({
        where: { eventId, voucherId },
        relations: { voucher: true },
      });
      if (
        !voucherInEvent ||
        voucherInEvent.quantity < quantity ||
        voucherInEvent.voucher.status !== VoucherStatus.EXPIRED
      ) {
        throw new Error("Voucher not found or not enough quantity");
      }
      // check if the account has that voucher
      const existedAccountVoucher = await this.accountVoucherRepo.findOne({ where: { accountId, voucherId } });

      // if existed, update the quantity, else create a new one
      return existedAccountVoucher
        ? this.accountVoucherRepo.updateOne(
            { where: { accountId, voucherId } },
            { quantity: existedAccountVoucher.quantity + quantity, status: VoucherStatus.ACTIVE }
          )
        : this.accountVoucherRepo.save({ accountId, voucherId, quantity });
    } catch (error) {
      throw error;
    }
  }

  async updateAccountVoucherStatus(accountVoucherId: string, data: UpdateAsssignVoucherDto) {
    try {
      // if this update the status of account voucher to EXPIRED, then update the status of voucher to EXPIRED
      const { quantity, status } = data;
      if (!isNil(status) && status === VoucherStatus.EXPIRED) {
        return this.accountVoucherRepo.updateOne({ where: { id: accountVoucherId } }, { status });
      }

      // update the quantity of account voucher -> user use the voucher
      const accountVoucher = await this.accountVoucherRepo.findOne({ where: { id: accountVoucherId } });
      if (accountVoucher.quantity < quantity) {
        throw new Error("Not enough quantity to update");
      }
      return accountVoucher.quantity === quantity
        ? this.accountVoucherRepo.updateOne(
            { where: { id: accountVoucherId } },
            { quantity: 0, status: VoucherStatus.INACTIVE }
          )
        : this.accountVoucherRepo.updateOne(
            { where: { id: accountVoucherId } },
            { quantity: accountVoucher.quantity - quantity }
          );
    } catch (error) {
      throw error;
    }
  }
}
