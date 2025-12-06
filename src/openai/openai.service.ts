import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import OpenAI from 'openai';
import type {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from 'openai/resources';

@Injectable()
export class OpenAIService {
  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private readonly ai = new OpenAI({
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  });

  private logger = new Logger('OpenAI');

  async ask(
    body: IAskBody,
    systemPrompt: string,
  ): Promise<ChatCompletionMessage> {
    if (body.clearMemory) await this.cacheManager.del(body.userId);

    const context =
      (await this.cacheManager.get<ChatCompletionMessageParam[]>(
        body.userId,
      )) || [];

    if (context.length == 0) {
      context.push(
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: JSON.stringify(body.data),
        },
      );
    } else {
      context.push({
        role: 'user',
        content: JSON.stringify(body.data),
      });
    }

    const response = await this.ai.chat.completions.create({
      model: this.configService.getOrThrow('GEMINI_MODEL'),
      messages: context,
    });

    context.push(response.choices[0].message);
    await this.cacheManager.set(body.userId, context, 600);

    return response.choices[0].message;
  }
}
