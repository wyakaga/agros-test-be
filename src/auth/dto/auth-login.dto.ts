import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { lowerCaseTransformer } from 'utils/transformers/lower-case.transformers';

export class AuthLoginDto {
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
