import {
  validate,
  ValidationArguments,
  ValidationError,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { plainToClass } from "class-transformer";
import {
  AccountRoleEnum,
  CreateAccountDto,
  CreateBrandInfoDto,
  CreatePlayerInfoDto,
  DEFAULT_INVALID_MESSAGE,
} from "../..";

@ValidatorConstraint({ async: true })
export class InfoValidation implements ValidatorConstraintInterface {
  private _validationErrors: ValidationError[] = [];

  async validate(data: any, args: ValidationArguments) {
    const object = args.object as CreateAccountDto;

    if (object.role === AccountRoleEnum.BRAND) {
      this._validationErrors = await validate(plainToClass(CreateBrandInfoDto, data));
    } else if (object.role === AccountRoleEnum.PLAYER) {
      this._validationErrors = await validate(plainToClass(CreatePlayerInfoDto, data));
    }

    return this._validationErrors.length === 0;
  }

  defaultMessage(args: ValidationArguments) {
    const firstError = this._validationErrors[0];
    const firstConstraint = this.getContraints(firstError);

    return firstConstraint ? firstConstraint[Object.keys(firstConstraint)[0]] : DEFAULT_INVALID_MESSAGE;
  }

  getContraints(error: ValidationError): Record<string, string> {
    if (error.constraints) {
      return error.constraints;
    }

    let contrains = {};
    if (error.children) {
      for (const child of error.children) {
        contrains = {
          ...contrains,
          ...this.getContraints(child),
        };
      }
    }
    return contrains;
  }
}
