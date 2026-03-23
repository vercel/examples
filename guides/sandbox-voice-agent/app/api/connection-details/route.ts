import { NextResponse } from 'next/server';
import { AccessToken, type AccessTokenOptions, type VideoGrant } from 'livekit-server-sdk';
import { RoomConfiguration } from '@livekit/protocol';
import { sandboxManager } from '@/lib/sandbox-manager';

type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
  sandboxId?: string;
  sandboxStatus?: string;
};

// NOTE: you are expected to define the following environment variables in `.env.local`:
const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;
const USE_SANDBOX = process.env.NEXT_PUBLIC_USE_SANDBOX === 'true';

// don't cache the results
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    if (LIVEKIT_URL === undefined) {
      throw new Error('LIVEKIT_URL is not defined');
    }
    if (API_KEY === undefined) {
      throw new Error('LIVEKIT_API_KEY is not defined');
    }
    if (API_SECRET === undefined) {
      throw new Error('LIVEKIT_API_SECRET is not defined');
    }

    // Parse agent configuration from request body
    const body = await req.json();
    const agentName: string = body?.room_config?.agents?.[0]?.agent_name;
    const sandboxId: string | undefined = body?.sandboxId;
    const roomName: string | undefined = body?.roomName;

    // If sandbox mode is enabled and sandboxId is provided, wait for sandbox to be ready
    if (USE_SANDBOX && sandboxId) {
      console.log(`[Connection Details] Checking sandbox ${sandboxId} status...`);

      const sandbox = sandboxManager.get(sandboxId);
      if (!sandbox) {
        throw new Error('Sandbox not found');
      }

      // Check if sandbox is ready
      if (sandbox.status !== 'ready' && sandbox.status !== 'running') {
        throw new Error(`Sandbox not ready. Current status: ${sandbox.status}`);
      }

      // Use the room name from the sandbox
      const finalRoomName =
        roomName ||
        sandbox.roomName ||
        `voice_assistant_room_${Math.floor(Math.random() * 10_000)}`;
      const participantName = 'user';
      const participantIdentity = `voice_assistant_user_${Math.floor(Math.random() * 10_000)}`;

      // Update sandbox to running status
      sandboxManager.updateStatus(sandboxId, 'running');

      const participantToken = await createParticipantToken(
        { identity: participantIdentity, name: participantName },
        finalRoomName,
        sandbox.agentName || agentName
      );

      // Return connection details with sandbox info
      const data: ConnectionDetails = {
        serverUrl: LIVEKIT_URL,
        roomName: finalRoomName,
        participantToken: participantToken,
        participantName,
        sandboxId: sandbox.id,
        sandboxStatus: sandbox.status,
      };
      const headers = new Headers({
        'Cache-Control': 'no-store',
      });
      return NextResponse.json(data, { headers });
    }

    // Standard flow (no sandbox)
    const participantName = 'user';
    const participantIdentity = `voice_assistant_user_${Math.floor(Math.random() * 10_000)}`;
    const finalRoomName = roomName || `voice_assistant_room_${Math.floor(Math.random() * 10_000)}`;

    const participantToken = await createParticipantToken(
      { identity: participantIdentity, name: participantName },
      finalRoomName,
      agentName
    );

    // Return connection details
    const data: ConnectionDetails = {
      serverUrl: LIVEKIT_URL,
      roomName: finalRoomName,
      participantToken: participantToken,
      participantName,
    };
    const headers = new Headers({
      'Cache-Control': 'no-store',
    });
    return NextResponse.json(data, { headers });
  } catch (error) {
    if (error instanceof Error) {
      console.error('[Connection Details] Error:', error);
      return new NextResponse(error.message, { status: 500 });
    }
  }
}

function createParticipantToken(
  userInfo: AccessTokenOptions,
  roomName: string,
  agentName?: string
): Promise<string> {
  const at = new AccessToken(API_KEY, API_SECRET, {
    ...userInfo,
    ttl: '15m',
  });
  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };
  at.addGrant(grant);

  if (agentName) {
    at.roomConfig = new RoomConfiguration({
      agents: [{ agentName }],
    });
  }

  return at.toJwt();
}
