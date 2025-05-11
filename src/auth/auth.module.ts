import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { JwtStrategy } from './jwt.strategy/jwt.strategy';
import { AuthGuard } from './auth.guard/auth.guard';

@Module({
  providers: [AuthService, JwtStrategy, AuthGuard],
  controllers: [AuthController]
})
export class AuthModule {}
