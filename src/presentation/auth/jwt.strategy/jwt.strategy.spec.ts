import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../shared/config/configuration';

describe('JwtStrategy', () => {
  let provider: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [JwtStrategy],
    }).compile();

    provider = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
