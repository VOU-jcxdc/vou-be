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
} from "../../../src";

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
    return firstError.constraints
      ? firstError.constraints[Object.keys(firstError.constraints)[0]]
      : DEFAULT_INVALID_MESSAGE;
  }
}
