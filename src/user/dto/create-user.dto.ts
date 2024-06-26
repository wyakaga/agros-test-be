import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { UserRole } from '../user.entity';
import { ContainsNumber } from 'utils/validators/contain-number.validator';
import { ContainsSymbol } from 'utils/validators/contain-symbol.validator';
import { ContainsUppercase } from 'utils/validators/contain-uppercase.validator';

export class CreateUserDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  city: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ContainsNumber()
  @ContainsSymbol()
  @ContainsUppercase()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @Matches(
    `^${Object.values(UserRole)
      .filter((v) => typeof v !== 'number')
      .join('|')}$`,
    'i',
  )
  role: UserRole;
}
