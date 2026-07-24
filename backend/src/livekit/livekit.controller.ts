import { Controller, Get, Param, UseGuards, Req, BadRequestException, ForbiddenException } from '@nestjs/common';
import { LivekitService } from './livekit.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SessionStatus } from '@prisma/client';

@Controller('livekit')
@UseGuards(JwtAuthGuard)
export class LivekitController {
  constructor(
    private readonly livekitService: LivekitService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * GET /livekit/token/:sessionId
   * Returns a LiveKit access token for the requesting user to join the session room.
   */
  @Get('token/:sessionId')
  async getToken(@Req() req: any, @Param('sessionId') sessionId: string) {
    const userId = req.user.id;
    const userRole = req.user.role;

    // 1. Find the session
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        student: true,
        lecturer: true,
      },
    });

    if (!session) {
      throw new BadRequestException('Session not found');
    }

    // 2. Verify the user is a participant of this session
    const isStudent = session.studentId === userId;
    const isLecturer = session.lecturerId === userId;
    const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

    if (!isStudent && !isLecturer && !isAdmin) {
      throw new ForbiddenException('You are not a participant of this session');
    }

    // 3. Verify the session is in a joinable state
    if (session.status === SessionStatus.CANCELED || session.status === SessionStatus.NO_SHOW_STUDENT) {
      throw new BadRequestException('This session has been canceled');
    }

    // 4. Check join window: 30 min before start to 2 hours after start
    const now = new Date();
    const startsAt = new Date(session.startsAt);
    const joinWindowStart = new Date(startsAt.getTime() - 30 * 60 * 1000); // 30 min before
    const joinWindowEnd = new Date(startsAt.getTime() + 2 * 60 * 60 * 1000); // 2 hours after start

    // if (now < joinWindowStart) {
    //   const minutesUntil = Math.ceil((joinWindowStart.getTime() - now.getTime()) / 60000);
    //   throw new BadRequestException(`Session room opens ${minutesUntil} minutes before the start time. Please come back later.`);
    // }

    // if (now > joinWindowEnd) {
    //   throw new BadRequestException('The join window for this session has expired');
    // }

    // 5. Update session status to IN_PROGRESS if it's still SCHEDULED and within start time
    if (session.status === SessionStatus.SCHEDULED && now >= startsAt) {
      await this.prisma.session.update({
        where: { id: sessionId },
        data: { status: SessionStatus.IN_PROGRESS },
      });
    }

    // 6. Generate the token
    const roomName = session.livekitRoomName || this.livekitService.getRoomName(sessionId);
    const participantName = isStudent ? session.student.fullName : session.lecturer.fullName;
    const identity = `${isStudent ? 'student' : 'lecturer'}:${userId}`;

    const { token, wsUrl } = await this.livekitService.generateToken(identity, participantName, roomName);

    return {
      token,
      wsUrl,
      roomName,
      session: {
        id: session.id,
        startsAt: session.startsAt,
        endsAt: session.endsAt,
        status: session.status,
        studentName: session.student.fullName,
        lecturerName: session.lecturer.fullName,
      },
    };
  }
}
