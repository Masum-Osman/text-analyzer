import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { TextService } from "src/application/text/services/text.service";
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('texts')
export class TextController {
    constructor(
        private readonly textService: TextService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() body: { content: string; createdBy: string }) {
      return this.textService.create(body.content, body.createdBy);
    }
  
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll() {
      return this.textService.findAll();
    }
  
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.textService.findById(id);
    }
  
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
      return this.textService.delete(id);
    }
  
    @UseGuards(JwtAuthGuard)
    @Get(':id/analyze')
    async analyze(@Param('id') id: string) {
      return this.textService.analyze(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/words')
    async wordCount(@Param('id') id: string) {
      const result = await this.textService.analyze(id);
      return { wordCount: result.wordCount };
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/characters')
    async characterCount(@Param('id') id: string) {
      const result = await this.textService.analyze(id);
      return { characterCount: result.characterCount };
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/sentences')
    async sentenceCount(@Param('id') id: string) {
      const result = await this.textService.analyze(id);
      return { sentenceCount: result.sentenceCount };
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/paragraphs')
    async paragraphCount(@Param('id') id: string) {
      const result = await this.textService.analyze(id);
      return { paragraphCount: result.paragraphCount };
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/longest-words')
    async longestWords(@Param('id') id: string) {
      const result = await this.textService.analyze(id);
      return { longestWords: result.longestWords };
    }

}
