import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { TextService } from 'src/application/text/services/text.service';
import { textSchema } from 'src/infrastructure/database/models/text.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: 'Text',
            schema: textSchema,
        }])
    ],
    controllers: [],
    providers: [TextService],
})

export class TextModule {}