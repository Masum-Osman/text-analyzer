import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TextDocument } from "src/infrastructure/database/models/text.schema";
import { TextAnalyzerService } from '../../../core/text/services/text-analyzer.service';
import { RedisService } from "../../../infrastructure/redis/redis.service";

export interface TextAnalysis {
  wordCount: number;
  characterCount: number;
  sentenceCount: number;
  paragraphCount: number;
  longestWords: string[];
}

@Injectable()
export class TextService {
  constructor(
    @InjectModel('Text') private readonly textModel: Model<TextDocument>,
    private readonly analyzer: TextAnalyzerService,
    private readonly redisService: RedisService
  ) {}

  async create(content: string, createdBy: string) {
    const text = new this.textModel({ content, createdBy });
    const saved = await text.save();

    await this.redisService.set(`text:${saved._id}`, saved);
    await this.redisService.del('text:all');

    return saved;
  }

  async findAll(): Promise<TextDocument[]> {
    const cacheKey = 'text:all';
    const cached = await this.redisService.get<TextDocument[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const allTexts = await this.textModel.find().exec();
    await this.redisService.set(cacheKey, allTexts);
    return allTexts;
  }

  async findById(id: string): Promise<TextDocument> {
    const cacheKey = `text:${id}`;
    const cached = await this.redisService.get<TextDocument>(cacheKey);

    if (cached) {
      return cached;
    }

    const text = await this.textModel.findById(id).exec();
    if (!text) {
      throw new NotFoundException('Text not found');
    }

    await this.redisService.set(cacheKey, text);
    return text;
  }

  async delete(id: string) {
    const deleted = await this.textModel.findByIdAndDelete(id).exec();

    await this.redisService.del(`text:${id}`);
    await this.redisService.del('text:all');
    await this.redisService.del(`text:analysis:${id}`);

    return deleted;
  }

  async analyze(id: string): Promise<TextAnalysis> {
    const cacheKey = `text:analysis:${id}`;
    const cached = await this.redisService.get<TextAnalysis>(cacheKey);

    if (cached) {
      return cached;
    }

    const text = await this.textModel.findById(id).exec();
    if (!text) {
      throw new NotFoundException('Text not found');
    }

    const analysis = await this.analyzer.analyze(text.content);

    await this.redisService.set(cacheKey, analysis);

    return analysis;
  }
}
