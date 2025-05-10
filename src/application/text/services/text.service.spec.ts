import { Test, TestingModule } from '@nestjs/testing';
import { TextService } from './text.service';
import { getModelToken } from '@nestjs/mongoose';
import { TextAnalyzerService } from '../../../core/text/services/text-analyzer.service';
import { RedisService } from '../../../infrastructure/redis/redis.service';

describe('TextService', () => {
  let service: TextService;

  const mockSave = jest.fn();
  const mockTextDoc = { content: 'to analyze', createdBy: 'user', save: mockSave };

  const mockTextModel = {
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockTextDoc),
    }),
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(['text1', 'text2']),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue('deleted-text'),
    }),
  };

  const mockModelConstructor = jest.fn().mockImplementation((data) => ({
    ...data,
    save: mockSave,
  }));

  const mockTextAnalyzerService = {
    analyze: jest.fn().mockReturnValue({
      wordCount: 2,
      characterCount: 11,
      sentenceCount: 1,
      paragraphCount: 1,
      longestWords: ['Hello', 'world'],
    }),
  };

  const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TextService,
        {
          provide: getModelToken('Text'),
          useValue: Object.assign(mockModelConstructor, mockTextModel),
        },
        {
          provide: TextAnalyzerService,
          useValue: mockTextAnalyzerService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<TextService>(TextService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a text', async () => {
    const content = 'Hello world';
    const createdBy = 'Test user';
    const expectedResult = { content, createdBy };

    mockSave.mockResolvedValue(expectedResult);

    const result = await service.create(content, createdBy);

    expect(mockModelConstructor).toHaveBeenCalledWith({ content, createdBy });
    expect(mockSave).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });

  it('should return cached text in findById if exists', async () => {
    mockRedisService.get.mockResolvedValue(mockTextDoc);

    const result = await service.findById('123');

    expect(mockRedisService.get).toHaveBeenCalledWith('text:123');
    expect(result).toEqual(mockTextDoc);
  });

  it('should fetch from DB and cache it if no cache found in findById', async () => {
    mockRedisService.get.mockResolvedValue(null);

    const result = await service.findById('123');

    expect(result).toEqual(mockTextDoc);
    expect(mockRedisService.set).toHaveBeenCalledWith('text:123', mockTextDoc);
  });

  it('should return cached analysis if exists in analyze', async () => {
    mockRedisService.get.mockResolvedValue('cached-analysis');

    const result = await service.analyze('456');

    expect(result).toBe('cached-analysis');
    expect(mockTextAnalyzerService.analyze).not.toHaveBeenCalled();
  });

  it('should analyze and cache if analysis not found', async () => {
    mockRedisService.get.mockResolvedValue(null);

    const analysisResult = await service.analyze('456');

    expect(mockTextAnalyzerService.analyze).toHaveBeenCalledWith('to analyze');
    expect(mockRedisService.set).toHaveBeenCalledWith('text:analysis:456', expect.any(Object));
    expect(analysisResult).toHaveProperty('wordCount');
  });

  it('should delete from DB and clear cache', async () => {
    const result = await service.delete('789');

    expect(result).toBe('deleted-text');
    expect(mockRedisService.del).toHaveBeenCalledWith('text:789');
    expect(mockRedisService.del).toHaveBeenCalledWith('text:all');
  });

  it('should return cached findAll if exists', async () => {
    mockRedisService.get.mockResolvedValue(['text1', 'text2']);

    const result = await service.findAll();

    expect(result).toEqual(['text1', 'text2']);
    expect(mockRedisService.get).toHaveBeenCalledWith('text:all');
  });

  it('should fetch all texts from DB and cache if not cached', async () => {
    mockRedisService.get.mockResolvedValue(null);

    const result = await service.findAll();

    expect(result).toEqual(['text1', 'text2']);
    expect(mockRedisService.set).toHaveBeenCalledWith('text:all', ['text1', 'text2']);
  });
});
