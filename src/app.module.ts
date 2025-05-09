import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { share } from 'rxjs';
import { SharedConfigModule } from './shared/config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './shared/config/configuration';
import { TextModule } from './presentation/text/text.module';
@Module({
  imports: [
    SharedConfigModule,
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: configuration().mongoUri,
      })
    }),
    TextModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
