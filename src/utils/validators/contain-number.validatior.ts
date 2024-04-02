import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'containsNumber', async: false })
export class ContainsNumberConstraint implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return /\d/.test(text);
  }

  defaultMessage(args: ValidationArguments) {
    return 'The $property must contain at least one number';
  }
}

export function ContainsNumber(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ContainsNumberConstraint,
    });
  };
}
