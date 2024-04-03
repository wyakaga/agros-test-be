import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from 'user/dto/create-user.dto';
import { LoginResponseType } from './types/login-response.type';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async register(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.service.register(createUserDto);
    return;
  }

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  public login(@Body() loginDto: AuthLoginDto): Promise<LoginResponseType> {
    return this.service.login(loginDto);
  }

  @Get('check')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  public checkToken(): Promise<LoginResponseType> {
    return;
  }
}
