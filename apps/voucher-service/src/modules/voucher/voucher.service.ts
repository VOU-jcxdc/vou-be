import { Injectable, Logger } from "@nestjs/common";
import { VoucherRepository } from "../repository/voucher.repository";
import {
  AddVoucherToAccountDto,
  CreateVoucherDto,
  UpdateAsssignVoucherDto,
  UpdateVoucherDto,
  VoucherStatusEnum,
} from "@types";
import { EventVoucherRepository } from "../repository/event-voucher.repository";
import { AccountVoucherRepository } from "../repository/account-voucher.repository";
import { isNil } from "lodash";
import { RpcException } from "@nestjs/microservices";
import moment from "moment";
@Injectable()
export class VoucherService {
  private readonly logger = new Logger(VoucherService.name);

  constructor(
    private readonly voucherRepo: VoucherRepository,
    private readonly eventVoucherRepo: EventVoucherRepository,
    private readonly accountVoucherRepo: AccountVoucherRepository
  ) {}

  async createVouchers(brandId: string, data: CreateVoucherDto) {
    try {
      const { eventId, vouchers } = data;
      const savedVouchers = await this.voucherRepo.saveManyVouchers(vouchers, brandId);
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
      this.logger.error(error);
      throw new RpcException(error);
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
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getVoucherById(voucherId: string) {
    try {
      return this.voucherRepo.findOne({
        where: { id: voucherId },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async updateVoucherDetail(voucherId: string, data: UpdateVoucherDto) {
    try {
      return this.voucherRepo.updateOne({ where: { id: voucherId } }, data);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async deleteVouchersInEvent(eventId: string, voucherIds: string[]) {
    try {
      return this.eventVoucherRepo.deleteVouchersInEvent(eventId, voucherIds);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getAccountVouchers(accountId: string) {
    try {
      return this.accountVoucherRepo.findAll({
        where: { accountId, status: VoucherStatusEnum.ACTIVE },
        relations: {
          voucher: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getOwnerVouchers(brandId: string) {
    try {
      return this.voucherRepo.findAll({
        where: { brandId },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async upsertAccountVoucher(accountId: string, data: AddVoucherToAccountDto) {
    try {
      // check if the voucher is in the event and has enough quantity
      const { eventVoucherId, quantity } = data;
      const voucherInEvent = await this.eventVoucherRepo.findOne({
        where: { id: eventVoucherId },
        relations: { voucher: true },
      });
      if (
        !voucherInEvent ||
        voucherInEvent.quantity < quantity ||
        voucherInEvent.voucher.status === VoucherStatusEnum.EXPIRED
      ) {
        throw new RpcException("Invalid voucher");
      }

      // update the quantity of voucher in the event
      const res = await this.eventVoucherRepo.updateOne(
        { where: { id: eventVoucherId } },
        { quantity: voucherInEvent.quantity - quantity }
      );

      const { voucherId } = voucherInEvent;
      // check if the account has that voucher
      const existedAccountVoucher = await this.accountVoucherRepo.findOne({ where: { accountId, voucherId } });

      // if existed, update the quantity, else create a new one
      return existedAccountVoucher
        ? this.accountVoucherRepo.updateOne(
            { where: { accountId, voucherId } },
            { quantity: existedAccountVoucher.quantity + quantity, status: VoucherStatusEnum.ACTIVE }
          )
        : this.accountVoucherRepo.save({ accountId, voucherId, quantity });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async updateAccountVoucherStatus(accountVoucherId: string, accountId: string, data: UpdateAsssignVoucherDto) {
    try {
      // if this update the status of account voucher to EXPIRED, then update the status of voucher to EXPIRED
      const { quantity, status } = data;
      if (!isNil(status) && status === VoucherStatusEnum.EXPIRED) {
        return this.accountVoucherRepo.updateOne({ where: { id: accountVoucherId, accountId } }, { status });
      }

      // update the quantity of account voucher -> user use the voucher
      const accountVoucher = await this.accountVoucherRepo.findOne({
        where: { id: accountVoucherId, accountId, status: VoucherStatusEnum.ACTIVE },
        relations: { voucher: true },
      });
      if (!accountVoucher || accountVoucher.quantity < quantity) {
        throw new Error("Voucher is unavailable");
      }

      const currentDate = moment();
      const expiredDate = moment(accountVoucher.assigenedOn).add(accountVoucher.voucher.duration, "seconds");

      if (currentDate.isAfter(expiredDate)) {
        throw new Error("Voucher is expired");
      }

      // if the quantity is equal to the quantity of account voucher, then update the status of account voucher to INACTIVE
      // else, update the quantity of account voucher
      return accountVoucher.quantity === quantity
        ? this.accountVoucherRepo.updateOne(
            { where: { id: accountVoucherId } },
            { quantity: 0, status: VoucherStatusEnum.INACTIVE }
          )
        : this.accountVoucherRepo.updateOne(
            { where: { id: accountVoucherId } },
            { quantity: accountVoucher.quantity - quantity }
          );
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async isCraftable(eventVoucherId: string, quantity: number) {
    try {
      const relatedEventVoucher = await this.eventVoucherRepo.findOne({ where: { id: eventVoucherId } });
      if (!relatedEventVoucher) throw new RpcException("No voucher related to this event");

      const activeVoucher = await this.voucherRepo.findOne({ where: { id: relatedEventVoucher.voucherId } });
      if (activeVoucher.status !== VoucherStatusEnum.ACTIVE) throw new RpcException("Voucher is not available");

      const data = await this.eventVoucherRepo.findOne({ where: { id: eventVoucherId } });
      if (!data) throw new RpcException("Item not found");
      if (data.quantity < quantity) return false;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getVoucher(voucherId: string) {
    try {
      return this.voucherRepo.findOne({ where: { id: voucherId } });
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async getEventVoucher(eventVoucherId: string) {
    try {
      const eventVoucher = await this.eventVoucherRepo.findOne({ where: { id: eventVoucherId } });
      if (!eventVoucher) throw new RpcException("Event voucher not found");

      return this.voucherRepo.findOne({ where: { id: eventVoucher.voucherId } });
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async assignVoucherToQuizGameWinner(eventId: string, accountId: string) {
    try {
      const eventVouchers = await this.eventVoucherRepo.findAll({ where: { eventId } });
      if (!eventVouchers || eventVouchers.length === 0) throw new RpcException("No voucher available");

      const voucher = eventVouchers[0];
      return this.upsertAccountVoucher(accountId, { eventVoucherId: voucher.id, quantity: 1 });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
