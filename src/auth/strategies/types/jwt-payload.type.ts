import { UserEntity as User } from 'src/user/user.entity';

export type JwtPayloadType = Pick<User, 'id' | 'role'> & {
  userId: User['id'];
  role: User['role'];
  iat: number;
  exp: number;
};
