import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compareSync } from 'bcryptjs';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, IStrategyOptions } from 'passport-local';
import { User } from '../entities/user.entity';

// 身份验证策略
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super({
            usernameField: 'username',
            passwordField: 'password',
        } as IStrategyOptions);
    }
    async validate(username: string, password: string): Promise<User> {
        const user = await this.userRepository.createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.username = :username', { username })
            .getOne();
        if (!user) {    
            throw new BadRequestException('用户不存在');
        }
        if (!compareSync(password, user.password)) {
            throw new BadRequestException('密码错误');
        }
        return user;
    }
}
