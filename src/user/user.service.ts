import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly redisService: RedisService // 注册Redis控制器
  ) {}

  // 注册
  async register(createUser: CreateUserDto): Promise<User> {
    const { username } = createUser;
    const user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }
    const newUser = await this.userRepository.create(createUser)
    return await this.userRepository.save(newUser);
  }

  // 生成token
  createToken(user: Partial<User>) {
    return this.jwtService.sign(user);
  }

  // 登录
  async login(userinfo): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username: userinfo.username },
    });
    if (!user) {
      throw new HttpException('用户名或密码错误', HttpStatus.BAD_REQUEST);
    }
    const token = this.createToken({ username: user.username, id: user.id })
    await this.redisService.set(`${user.id}&${user.username}`, token, 1800);
    const obj: any = {
      ...user,
      token: 'Bearer ' + token
    }
    return obj;
  }

  // 获取用户信息
  async getUser(userinfo): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username: userinfo.username },
    });
    return user;
  }
}
