import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seedUserIfNotExists(): Promise<void> {
    const existingUser = await this.userRepository.find();
    if (existingUser.length === 0) {

      const user = new User();
      user.email = 'admin@gmail.com';
      user.username = 'admin';
      user.role = 'admin';

      const saltOrRounds = 10;
      const hashPassword = await bcrypt.hash('admin', saltOrRounds);

      user.password = hashPassword;

      await this.userRepository.save(user);
    }
  } 
}