import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { StrategyOptions, Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserService } from '../user.service';

// 验证token
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User) 
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        } as StrategyOptions);
    }
    
    async validate(payload: User): Promise<User> {
        console.log('payload', payload);
        const existUser = await this.userService.getUser(payload);
        if (!existUser) {
            throw new UnauthorizedException('token不正确');
        }
        return existUser;
    }
}