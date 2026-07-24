import { Injectable } from '@nestjs/common';
import { AccessToken } from 'livekit-server-sdk';

@Injectable()
export class LivekitService {
  private readonly apiKey = process.env.LIVEKIT_API_KEY;
  private readonly apiSecret = process.env.LIVEKIT_API_SECRET;
  private readonly wsUrl = process.env.LIVEKIT_URL;

  /**
   * Generate a deterministic LiveKit room name from a session ID.
   */
  getRoomName(sessionId: string): string {
    return `ilm-session-${sessionId}`;
  }

  /**
   * Generate a LiveKit access token for a participant.
   * @param identity  Unique participant identity (e.g., "student:userId")
   * @param name      Display name (e.g., "Zayd Al-Faisal")
   * @param roomName  The LiveKit room to join
   */
  async generateToken(identity: string, name: string, roomName: string): Promise<{ token: string; wsUrl: string }> {
    const at = new AccessToken(this.apiKey, this.apiSecret, {
      identity,
      name,
      ttl: '2h', // 2 hours — covers a 45-min session with generous buffer
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true, // For chat messages via DataChannel
    });

    const token = await at.toJwt();
    return { token, wsUrl: this.wsUrl! };
  }
}
