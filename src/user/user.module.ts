import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LocalStrategy } from './local/local.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';
import { RedisModule } from '../redis/redis.module'; // 添加RedisModule

// jwt 生成token
// 注册JwtModule
const jwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get('JWT_SECRET'),
      signOptions: {
        expiresIn: configService.get('JWT_EXPIRES'),
      },
    };
  },
});

@Module({
  imports: [TypeOrmModule.forFeature([User]), jwtModule, RedisModule],
  controllers: [UserController],
  providers: [UserService, LocalStrategy, JwtStrategy],
  exports: [jwtModule],
})
export class UserModule {}
