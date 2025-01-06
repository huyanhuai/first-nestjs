import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
    private redisClient: Redis;

    constructor(
        private readonly configService: ConfigService,
    ) {
        // 配置 Redis 连接
        this.redisClient = new Redis({
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
            db: 0,
            password: configService.get('REDIS_PASSWORD'),
        });
    }

    /**
     * 获取值
     * @param key - 缓存键
     * @returns 缓存值
     */
    async get(key: string): Promise<string | null> {
        return this.redisClient.get(key);
    }

    /**
     * 设置值
     * @param key - 缓存键
     * @param value - 缓存值
     * @param EX - 过期时间（秒），可选
     * @returns 设置结果
     */
    async set(key: string, value: string, EX: number = -1): Promise<string> {
        if (EX > 0) {
            return this.redisClient.set(key, value, 'EX', EX);
        } else {
            return this.redisClient.set(key, value);
        }
    }

    /**
     * 关闭 Redis 客户端连接
     */
    async onModuleDestroy(): Promise<void> {
        await this.redisClient.quit();
    }
}
