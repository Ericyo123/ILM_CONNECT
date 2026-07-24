import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('threads')
  getThreads(@Request() req: any) {
    return this.messageService.getThreads(req.user.id);
  }

  @Get(':threadId')
  getMessagesInThread(@Request() req: any, @Param('threadId') threadId: string) {
    return this.messageService.getMessagesInThread(req.user.id, threadId);
  }

  @Post()
  sendMessage(
    @Request() req: any,
    @Body('recipientId') recipientId: string,
    @Body('content') content: string,
    @Body('threadId') threadId?: string,
  ) {
    return this.messageService.sendMessage(req.user.id, recipientId, content, threadId);
  }
}
