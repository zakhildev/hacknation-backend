import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*' });

  const configService = app.get(ConfigService);

  configService.getOrThrow('OPENAI_API_KEY');
  configService.getOrThrow('GEMINI_MODEL');

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
