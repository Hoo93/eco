import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsTimeFormatConstraint implements ValidatorConstraintInterface {
  validate(time: string, args: ValidationArguments) {
    if (typeof time !== 'string' || time.length !== 4) {
      return false;
    }

    const hour = time.slice(0, time.length - 2);
    const minute = time.slice(time.length - 2);

    return !(parseInt(hour) >= 24 || parseInt(minute) >= 60);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid time format';
  }
}

export function IsTimeFormat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTimeFormatConstraint,
    });
  };
}
