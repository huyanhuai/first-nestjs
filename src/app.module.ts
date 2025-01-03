import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import envConfig  from '../config/env';
import { PostsEntity } from './posts/posts.entity';
import { LoggerService } from './logger/logger.service';
import { UserModule } from './user/user.module';
import { PassportModule } from '@nestjs/passport';
// import { LocalStrategy } from './user/local/local.strategy';
import { User } from './user/entities/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './user/jwt/jwt.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局
      envFilePath: [envConfig.path],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql', // 数据库类型
          autoLoadEntities: true, // 自动加载模块
          // entities: [__dirname + '/**/*.entity{.ts,.js}'],
          // entities: [PostsEntity],  // 数据表实体，synchronize为true时，自动创建表，生产环境建议关闭
          hhost: configService.get('DB_HOST'), // 主机，默认为localhost
          port: configService.get<number>('DB_PORT'), // 端口号
          username: configService.get('DB_USER'), // 用户名
          password: configService.get('DB_PASSWD'), // 密码
          database: configService.get('DB_DATABASE'), //数据库名
          timezone: '+08:00', //服务器上配置的时区
          synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
        }
      }
    }),
    PostsModule,
    UserModule,
    TypeOrmModule.forFeature([User]),
    PassportModule 
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
