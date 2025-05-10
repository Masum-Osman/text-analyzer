import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { TextService } from 'src/application/text/services/text.service';
import { textSchema } from 'src/infrastructure/database/models/text.schema';
import { TextController } from './text.controller';
import { TextAnalyzerService } from 'src/core/text/services/text-analyzer.service';
import { RedisService } from 'src/infrastructure/redis/redis.service';

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: 'Text',
            schema: textSchema,
        }])
    ],
    controllers: [TextController],
    providers: [
        TextService,
        TextAnalyzerService,
        RedisService,
    ],
})

export class TextModule {}