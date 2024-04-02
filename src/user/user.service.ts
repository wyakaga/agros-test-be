import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find({ withDeleted: false });
  }

  async findOne(
    where: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
  ): Promise<UserEntity> {
    return this.userRepository.findOne({
      where,
    });
  }

  async create(userData: CreateUserDto): Promise<UserEntity> {
    const userObject = await this.userRepository.findOne({
      where: {
        email: userData.email,
      },
    });

    if (userObject?.email === userData.email) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'email already registered!',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const roleObject = Object.values(UserRole).includes(userData.role);

    if (!roleObject) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: "role didn't exist",
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const salt = await bcrypt.genSalt();
    userData.password = await bcrypt.hash(userData.password, salt);

    return await this.userRepository.save(this.userRepository.create(userData));
  }

  async update(id: string, userData: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne({
      id,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: {
            user: 'No such user exists',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (userData.email) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'Email cannot be changed',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (userData.fullName) user.fullName = userData.fullName;
    if (userData.city) user.city = userData.city;
    if (userData.password) user.password = userData.password;
    return await this.userRepository.save(user);
  }

  async softDelete(id: string): Promise<void> {
    const user = await this.findOne({
      id,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: {
            user: 'No such user exists',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.userRepository.softDelete(user.id);
    return;
  }
}
