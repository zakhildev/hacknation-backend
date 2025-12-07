import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  WsResponse,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OpenAIService } from './openai/openai.service';
import { DOCUMENT_PROMPT } from './openai/prompts';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayConnection {
  constructor(readonly ai: OpenAIService) {}

  private readonly logger = new Logger('SocketGateway');

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.verbose(`New client connected: ${client.id}`);
  }

  @SubscribeMessage('query')
  async handleDocumentQuery(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: IAskBody,
  ): Promise<WsResponse<unknown>> {
    body.userId = socket.id;
    const response = await this.ai.ask(body, DOCUMENT_PROMPT);
    return {
      event: 'response',
      data: {
        task: body.data.task,
        response,
      },
    };
  }

  // @SubscribeMessage('learn_query')
  // async handleLearnQuery(
  //   socket: Socket,
  //   @MessageBody() body: IAskBody,
  // ): Promise<WsResponse<ChatCompletionMessage>> {
  //   this.logger.debug(socket);
  //   const response = await this.ai.ask(body, LEARN_PROMPT);
  //   return {
  //     event: 'learn_response',
  //     data: response,
  //   };
  // }
}
