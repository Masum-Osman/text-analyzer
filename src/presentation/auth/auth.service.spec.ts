import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  const mockUserService = {
    findByUsername: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should validate user with correct credentials', async () => {
    const user = { 
      username: 'john', 
      password: await bcrypt.hash('1234', 10),
      toObject: function() { 
        return { username: this.username, password: this.password };
      }
    };
    mockUserService.findByUsername.mockResolvedValue(user);

    const result = await authService.validateUser('john', '1234');
    expect(result).toEqual({ username: 'john' });
  });

  it('should return null with incorrect password', async () => {
    const user = { username: 'john', password: await bcrypt.hash('1234', 10) };
    mockUserService.findByUsername.mockResolvedValue(user);

    const result = await authService.validateUser('john', 'wrong');
    expect(result).toBeNull();
  });

  it('should return JWT token on login', async () => {
    const user = { username: 'john', _id: '123' };
    const token = await authService.login(user);
    expect(token).toEqual({ access_token: 'mock-token' });
    expect(jwtService.sign).toHaveBeenCalledWith({ username: 'john', sub: '123' });
  });
});
