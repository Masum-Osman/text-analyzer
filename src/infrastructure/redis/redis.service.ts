import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
    private readonly logger = new Logger(RedisService.name);
    private redisClient: Redis;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.redisClient = new Redis({
            host: this.configService.get('redis.host'),
            port: this.configService.get('redis.port'),
            password: this.configService.get('redis.password'),
            db: this.configService.get('redis.db'),
        });
    }
    
    onModuleInit() {    }

    async set<T>(key: string, value: T, ttlInSec?: number): Promise<void> {
        const ttl = ttlInSec || this.configService.get('redis.ttl');
        await this.redisClient.set(key, JSON.stringify(value));
    }
    

    async get<T>(key: string): Promise<T | null> {
        const value = await this.redisClient.get(key);
        return value ? JSON.parse(value) : null;
      }
}
