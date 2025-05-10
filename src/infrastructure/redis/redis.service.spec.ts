import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { SharedConfigModule } from '../../shared/config/config.module';

describe('RedisService', () => {
  let service: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SharedConfigModule
      ],
      providers: [RedisService],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set and get data from Redis', async () => {
    await service.set('key1', 'value1');
    const result = await service.get('key1');
    expect(result).toBe('value1');
  });

  // it('should set data with TTL and expire', async () => {
  //   await service.set('key2', 'value2', 1);
  //   const result = await service.get('key2');
  //   expect(result).toBe('value2');

  //   await new Promise(resolve => setTimeout(resolve, 2000));

  //   const expiredResult = await service.get('key2');
  //   expect(expiredResult).toBeNull();
  // });

  // it('should handle errors gracefully if Redis is not available', async () => {
  //   const mockService = {
  //     set: jest.fn().mockRejectedValue(new Error('Redis not available')),
  //     get: jest.fn().mockRejectedValue(new Error('Redis not available')),
  //   };
  //   const serviceWithErrorHandling = new RedisService(mockService as any);
    
  //   await expect(serviceWithErrorHandling.set('key3', 'value3')).rejects.toThrow('Redis not available');
  //   await expect(serviceWithErrorHandling.get('key3')).rejects.toThrow('Redis not available');
  // });
});

