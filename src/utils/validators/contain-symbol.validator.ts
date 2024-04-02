import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'containsSymbol', async: false })
export class ContainsSymbolConstraint implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return /[\W_]/.test(text);
  }

  defaultMessage(args: ValidationArguments) {
    return 'The $property must contain at least one symbol';
  }
}

export function ContainsSymbol(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ContainsSymbolConstraint,
    });
  };
}
