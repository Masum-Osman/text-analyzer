import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { TextService } from "src/application/text/services/text.service";

@Controller('texts')
export class TextController {
    constructor(
        private readonly textService: TextService,
    ) {}

    @Post()
    async create(@Body() body: { content: string; createdBy: string }) {
      return this.textService.create(body.content, body.createdBy);
    }
  
    @Get()
    async findAll() {
      return this.textService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.textService.findById(id);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string) {
      return this.textService.delete(id);
    }
  
    @Get(':id/analyze')
    async analyze(@Param('id') id: string) {
    //   return this.textService.analyze(id);
        return
    }
}
