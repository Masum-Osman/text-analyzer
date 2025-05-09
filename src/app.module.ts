import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { share } from 'rxjs';
import { SharedConfigModule } from './shared/config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './shared/config/configuration';
import { TextModule } from './presentation/text/text.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { config } from 'dotenv';
import { redisStore } from 'cache-manager-ioredis';



@Module({
  imports: [
    SharedConfigModule,
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: configuration().mongoUri,
      })
    }),
    TextModule,    
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [configuration],
      useFactory: async (config: ReturnType<typeof configuration>) => ({
        store: await redisStore({
          host: config.redis.host,
          port: config.redis.port,
          ttl: config.redis.ttl,
        })
      })
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})

export class AppModule {}
