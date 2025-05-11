import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


describe('AuthService', () => {
  let service: AuthService;
  const mockUserService = {
    findByUsername: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

    const result = await service.validateUser('john', '1234');
    expect(result).toEqual({ username: 'john' });
  });


  it('should return null with incorrect password', async () => {
    const user = { username: 'john', password: await bcrypt.hash('1234', 10) };
    mockUserService.findByUsername.mockResolvedValue(user);

    const result = await service.validateUser('john', 'wrong');
    expect(result).toBeNull();
  });

  // it('should return JWT token on login', async () => {
  //   const user = { username: 'john', _id: '123' };
  //   jest.spyOn(jwtService, 'sign').mockReturnValue('mock-token');
  
  //   const token = await authService.login(user);
  //   expect(token).toEqual({ access_token: 'mock-token' });
  // });
});
