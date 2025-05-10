import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
    private readonly logger = new Logger(RedisService.name);
    private redisClient: Redis;

    constructor(){}
    onModuleInit() {    }

    async set(){}

    async get(){}
}
