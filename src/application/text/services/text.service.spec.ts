import { Test, TestingModule } from '@nestjs/testing';
import { TextService } from './text.service';
import { getModelToken } from '@nestjs/mongoose';
import { TextAnalyzerService } from '../../../core/text/services/text-analyzer.service';

describe('TextService', () => {
  let service: TextService;

  const mockSave = jest.fn();
  const mockTextModel = jest.fn().mockImplementation(() => ({
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TextService,
        {
          provide: getModelToken('Text'),
          useValue: mockTextModel,
        },
        {
          provide: TextAnalyzerService,
          useValue: mockTextAnalyzerService,
        },
      ],
    }).compile();

    service = module.get<TextService>(TextService);
    mockSave.mockReset();
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

    expect(mockTextModel).toHaveBeenCalledWith({ content, createdBy });
    expect(mockSave).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });
});
