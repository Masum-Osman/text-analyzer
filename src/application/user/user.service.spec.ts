import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Model } from 'mongoose';
import { User } from 'src/infrastructure/database/models/user.schema';
import { create } from 'domain';
import { getModelToken } from '@nestjs/mongoose';


describe('UserService', () => {
  let service: UserService;
  let model: Model<User>

  const mockUserModel = {
    create: jest.fn(),
    findOne: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken('User'));

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const userDto = { username: 'test', password: 'pass123' };
      const createdUser = { ...userDto, _id: '1' };

      mockUserModel.create.mockResolvedValue(createdUser);

      expect(await service.create(userDto)).toEqual(createdUser);
      expect(mockUserModel.create).toHaveBeenCalledWith(userDto);
    });
  });

  describe('findByUsername', () => {
    it('should return a user if found', async () => {
      const user = { username: 'test', password: 'hashedPass' };
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      expect(await service.findByUsername('test')).toEqual(user);
    });

    it('should return null if user not found', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      expect(await service.findByUsername('unknown')).toBeNull();
    });
  });
});
