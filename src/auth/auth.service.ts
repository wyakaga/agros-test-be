import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { LoginResponseType } from './types/login-response.type';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto): Promise<UserEntity> {
    const userDto: CreateUserDto = {
      email: dto.email,
      password: dto.password,
      fullName: dto.fullName,
      city: dto.city,
      role: dto.role,
    };

    const createdUser = await this.userService.create(userDto);

    return createdUser;
  }

  async login(loginDto: AuthLoginDto): Promise<LoginResponseType> {
    const user = await this.userService.findOne([
      {
        email: loginDto.email,
      },
      {
        password: loginDto.password,
      },
    ]);

    if (!user) {
      throw new UnprocessableEntityException({
        errors: {
          email: "Didn't match",
          password: "Didn't match",
        },
      });
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnprocessableEntityException({
        errors: {
          email: "Didn't match",
          password: "Didn't match",
        },
      });
    }

    const { token, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
    });

    return {
      token,
      tokenExpires,
      user,
    };
  }

  private async getTokensData(data: {
    id: UserEntity['id'];
    role: UserEntity['role'];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn as string);

    const token = await this.jwtService.signAsync(
      {
        id: data.id,
        role: data.role,
      },
      {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
        expiresIn: tokenExpiresIn,
      },
    );

    return {
      token,
      tokenExpires,
    };
  }
}
