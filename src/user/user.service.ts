import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 注册
  async register(createUser: CreateUserDto): Promise<User> {
    const { username } = createUser;
    const user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }
    return await this.userRepository.save(createUser);
    // return await this.userRepository.findOne({where:{username}})
  }
}
