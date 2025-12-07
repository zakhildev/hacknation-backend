import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [OpenAIService],
  exports: [OpenAIService],
  imports: [PrismaModule],
})
export class OpenAIModule {}
