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
import { RedisModule } from './infrastructure/redis/redis.module';
import { UserModule } from './presentation/user/user.module';
import { AuthModule } from './presentation/auth/auth.module';
import { JwtStrategy } from './presentation/auth/jwt.strategy/jwt.strategy';



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
    RedisModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    JwtStrategy,
  ],
})

export class AppModule {}
