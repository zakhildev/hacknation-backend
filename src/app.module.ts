import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { OpenAIModule } from './openai/openai.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [],
  providers: [AppGateway],
  imports: [
    OpenAIModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
