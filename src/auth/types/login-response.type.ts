import { UserEntity as User } from '../../user/user.entity';

export type LoginResponseType = Readonly<{
  token: string;
  tokenExpires: number;
  user: User;
}>;
