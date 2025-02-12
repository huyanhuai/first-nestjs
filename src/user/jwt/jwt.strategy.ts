import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { StrategyOptions, Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserService } from '../user.service';
import { RedisService } from '../../redis/redis.service'

// 验证token
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User) 
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private readonly redisService: RedisService
    ) {
        super({
            // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 默认从Authorization中获取token
            jwtFromRequest: ExtractJwt.fromHeader('token'), // 从请求头中获取token
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
            passReqToCallback: true // 允许将请求对象作为第一个参数传递到验证回调函数
        } as StrategyOptions);
    }
    
    async validate(req, user: User): Promise<User> {
        // console.log('user', user);
        // const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req)
        const token = req.get('token');
        // console.log('token', token);
        
        const cacheToken  = await this.redisService.get(`${user.id}&${user.username}`);
        if (!cacheToken) {
            throw new UnauthorizedException('token已过期');
        }
        // 判断redis中的token与请求传入的token是否相同
        if (cacheToken !== token) {
            throw new UnauthorizedException('token不正确');
        }
        const existUser = await this.userService.getUser(user);
        if (!existUser) {
            throw new UnauthorizedException('token不正确');
        }
        return existUser;
    }
}