import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'containsUppercase', async: false })
export class ContainsUppercaseConstraint
  implements ValidatorConstraintInterface
{
  validate(text: string, args: ValidationArguments) {
    return /[A-Z]/.test(text); // Check if the string contains at least one uppercase character
  }

  defaultMessage(args: ValidationArguments) {
    return 'The $property must contain at least one uppercase character';
  }
}

export function ContainsUppercase(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ContainsUppercaseConstraint,
    });
  };
}
