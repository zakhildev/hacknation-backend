import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from 'openai/resources';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OpenAIService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  private readonly ai = new OpenAI({
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  });

  async ask(
    body: IAskBody,
    systemPrompt: string,
  ): Promise<ChatCompletionMessage> {
    let currentCache = await this.prisma.cache.findFirst({
      where: { socketId: body.userId },
    });

    if (!currentCache) {
      currentCache = await this.prisma.cache.create({
        data: {
          cache: '',
          socketId: body.userId,
        },
      });
    }

    let context: ChatCompletionMessageParam[] = [];

    if (currentCache?.cache) {
      try {
        context = JSON.parse(
          currentCache.cache,
        ) as ChatCompletionMessageParam[];
      } catch {
        context = [];
      }
    }

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

    await this.prisma.cache.upsert({
      where: { socketId: body.userId, id: currentCache.id },
      update: { cache: JSON.stringify(context) },
      create: {
        socketId: body.userId,
        cache: JSON.stringify(context),
      },
    });

    return response.choices[0].message;
  }
}
