import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy/jwt.strategy';
import { UserModule } from '../user/user.module';
import configuration from '../../shared/config/configuration';


@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: configuration().jwt_secret ?? '', 
      signOptions: { expiresIn: configuration().jwt_expires_in ?? '' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
