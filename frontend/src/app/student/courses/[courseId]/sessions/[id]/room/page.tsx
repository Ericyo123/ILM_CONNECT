'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  LiveKitRoom,
  VideoTrack,
  useTracks,
  useParticipants,
  useLocalParticipant,
  useRoomContext,
  useConnectionState,
  TrackToggle,
  DisconnectButton,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track, ConnectionState, RoomEvent } from 'livekit-client';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare,
  Monitor, X, ChevronRight, Loader2, Camera, AlertTriangle,
  Clock, Wifi, WifiOff,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

// ─── Types ───────────────────────────────────────────────────────────────────
interface SessionInfo {
  id: string;
  startsAt: string;
  endsAt: string;
  status: string;
  studentName: string;
  lecturerName: string;
}

interface TokenResponse {
  token: string;
  wsUrl: string;
  roomName: string;
  session: SessionInfo;
}

// ─── Pre-Join Screen ─────────────────────────────────────────────────────────
function PreJoinScreen({ onJoin, sessionInfo }: { onJoin: () => void; sessionInfo: SessionInfo | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);

  useEffect(() => {
    let s: MediaStream | null = null;
    (async () => {
      try {
        s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (err) {
        console.error('Could not access media devices:', err);
      }
    })();
    return () => { s?.getTracks().forEach(t => t.stop()); };
  }, []);

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach(t => { t.enabled = !micEnabled; });
      setMicEnabled(!micEnabled);
    }
  };

  const toggleCam = () => {
    if (stream) {
      stream.getVideoTracks().forEach(t => { t.enabled = !camEnabled; });
      setCamEnabled(!camEnabled);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a] flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">Ready to Join?</h1>
          {sessionInfo && (
            <p className="text-white/60 text-sm">
              Session with <span className="text-white font-medium">{sessionInfo.lecturerName}</span>
            </p>
          )}
        </div>

        {/* Camera Preview */}
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10">
          {camEnabled ? (
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center mb-3">
                <VideoOff className="h-8 w-8 text-white/40" />
              </div>
              <p className="text-white/50 text-sm">Camera is off</p>
            </div>
          )}

          {/* AV toggle overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
            <button onClick={toggleMic} className={`h-11 w-11 rounded-full flex items-center justify-center transition-all ${micEnabled ? 'bg-white/15 hover:bg-white/25 text-white' : 'bg-red-500 text-white'}`}>
              {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>
            <button onClick={toggleCam} className={`h-11 w-11 rounded-full flex items-center justify-center transition-all ${camEnabled ? 'bg-white/15 hover:bg-white/25 text-white' : 'bg-red-500 text-white'}`}>
              {camEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Join Button */}
        <button
          onClick={onJoin}
          className="w-full py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)] hover:shadow-lg hover:shadow-[hsl(168,80%,26%)/0.3] transition-all flex items-center justify-center gap-2"
        >
          <Camera className="h-5 w-5" />
          Join Session
        </button>
      </div>
    </div>
  );
}

// ─── Session Timer ───────────────────────────────────────────────────────────
function SessionTimer({ startsAt }: { startsAt: string }) {
  const [elapsed, setElapsed] = useState('00:00:00');

  useEffect(() => {
    const start = new Date(startsAt).getTime();
    const interval = setInterval(() => {
      const diff = Math.max(0, Date.now() - start);
      const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setElapsed(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [startsAt]);

  return (
    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-white/10 text-white/70 flex items-center gap-1.5">
      <Clock className="h-3 w-3" /> {elapsed}
    </span>
  );
}

// ─── Connection Indicator ────────────────────────────────────────────────────
function ConnectionIndicator() {
  const state = useConnectionState();

  const config: Record<string, { label: string; color: string; icon: any }> = {
    [ConnectionState.Connected]: { label: 'Connected', color: 'bg-green-500/20 text-green-400', icon: Wifi },
    [ConnectionState.Connecting]: { label: 'Connecting...', color: 'bg-yellow-500/20 text-yellow-400', icon: Wifi },
    [ConnectionState.Reconnecting]: { label: 'Reconnecting...', color: 'bg-yellow-500/20 text-yellow-400', icon: Wifi },
    [ConnectionState.Disconnected]: { label: 'Disconnected', color: 'bg-red-500/20 text-red-400', icon: WifiOff },
  };

  const c = config[state as string] || config[ConnectionState.Disconnected as string];
  const Icon = c.icon;

  return (
    <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${c.color}`}>
      <Icon className="h-3.5 w-3.5" /> {c.label}
    </div>
  );
}

// ─── Video Stage ─────────────────────────────────────────────────────────────
function VideoStage({ sessionInfo, showChat, setShowChat }: {
  sessionInfo: SessionInfo;
  showChat: boolean;
  setShowChat: (v: boolean) => void;
}) {
  const router = useRouter();
  const params = useParams();
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
    { source: Track.Source.Microphone, withPlaceholder: false },
  ]);
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();
  const room = useRoomContext();
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Find remote participant's camera track
  const remoteCameraTrack = tracks.find(
    t => t.participant.identity !== localParticipant.identity && t.source === Track.Source.Camera && t.publication?.track
  );

  // Find local camera track
  const localCameraTrack = tracks.find(
    t => t.participant.identity === localParticipant.identity && t.source === Track.Source.Camera && t.publication?.track
  );

  // Find screen share track (from either participant)
  const screenShareTrack = tracks.find(t => t.source === Track.Source.ScreenShare && t.publication?.track);

  // Remote participant info
  const remoteParticipant = participants.find(p => p.identity !== localParticipant.identity);
  const remoteName = remoteParticipant?.name || sessionInfo.lecturerName;

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        await localParticipant.setScreenShareEnabled(false);
        setIsScreenSharing(false);
      } else {
        await localParticipant.setScreenShareEnabled(true);
        setIsScreenSharing(true);
      }
    } catch (err) {
      console.error('Screen share error:', err);
    }
  };

  const handleLeave = () => {
    room.disconnect();
    router.push(`/student/courses/${params.courseId}/feedback`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a] text-white flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-5 bg-[#0f172a]/80 backdrop-blur-md flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
          <h1 className="font-semibold text-sm lg:text-base truncate">Quran Session</h1>
          <SessionTimer startsAt={sessionInfo.startsAt} />
        </div>
        <ConnectionIndicator />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Stage */}
        <div className={`flex-1 relative transition-all duration-300 p-3 ${showChat ? 'mr-[320px]' : ''}`}>
          <div className="w-full h-full bg-black rounded-2xl overflow-hidden relative border border-white/10">
            {/* Main Video (Remote or Screen Share) */}
            {screenShareTrack?.publication?.track ? (
              <VideoTrack trackRef={screenShareTrack} className="w-full h-full object-contain" />
            ) : remoteCameraTrack?.publication?.track ? (
              <VideoTrack trackRef={remoteCameraTrack} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[hsl(168,65%,45%)] to-[hsl(168,50%,55%)] flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-white">
                    {remoteName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <p className="text-white/60 text-sm">{remoteName}</p>
                <p className="text-white/30 text-xs mt-1">Waiting for video...</p>
              </div>
            )}

            {/* Remote name label */}
            <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1.5 rounded-lg text-sm font-medium backdrop-blur-sm z-10">
              {remoteName}
            </div>

            {/* Local PiP */}
            <div className="absolute bottom-3 right-3 w-40 lg:w-48 aspect-video bg-[#1e293b] rounded-xl border-2 border-white/20 overflow-hidden shadow-2xl z-10">
              {localCameraTrack?.publication?.track ? (
                <VideoTrack trackRef={localCameraTrack} className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <VideoOff className="h-5 w-5 text-white/30" />
                </div>
              )}
              <div className="absolute bottom-1.5 left-1.5 bg-black/60 px-2 py-0.5 rounded text-[10px] font-medium z-10">
                You
              </div>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className={`absolute top-14 right-0 bottom-[76px] w-[320px] bg-[#1e293b] border-l border-white/10 flex flex-col transition-transform duration-300 ${showChat ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="font-semibold flex items-center gap-2 text-sm"><MessageSquare className="h-4 w-4" /> Chat</h2>
            <button onClick={() => setShowChat(false)} className="p-1 hover:bg-white/10 rounded-md transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="text-center py-8">
              <MessageSquare className="h-8 w-8 mx-auto text-white/20 mb-2" />
              <p className="text-xs text-white/40">Chat messages will appear here</p>
            </div>
          </div>
          <div className="p-3 border-t border-white/10 bg-[#0f172a]/50">
            <div className="relative">
              <input type="text" placeholder="Type a message..." className="w-full bg-black/50 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(168,80%,26%)] text-white placeholder-white/30" />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/50 hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="h-[76px] bg-[#0f172a] border-t border-white/10 flex items-center justify-center px-6 gap-3 z-10 flex-shrink-0">
        {/* Mic */}
        <button
          onClick={() => localParticipant.setMicrophoneEnabled(!localParticipant.isMicrophoneEnabled)}
          className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${localParticipant.isMicrophoneEnabled ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500 hover:bg-red-600'}`}
        >
          {localParticipant.isMicrophoneEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </button>

        {/* Camera */}
        <button
          onClick={() => localParticipant.setCameraEnabled(!localParticipant.isCameraEnabled)}
          className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${localParticipant.isCameraEnabled ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500 hover:bg-red-600'}`}
        >
          {localParticipant.isCameraEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </button>

        {/* Screen Share */}
        <button
          onClick={toggleScreenShare}
          className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${isScreenSharing ? 'bg-[hsl(168,80%,26%)] ring-2 ring-[hsl(168,80%,26%)]' : 'bg-white/10 hover:bg-white/20'}`}
        >
          <Monitor className="h-5 w-5" />
        </button>

        {/* Chat Toggle */}
        {!showChat && (
          <button onClick={() => setShowChat(true)} className="h-12 w-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all">
            <MessageSquare className="h-5 w-5" />
          </button>
        )}

        {/* Leave */}
        <button onClick={handleLeave} className="ml-6 px-6 py-2.5 rounded-full text-sm font-semibold bg-red-500 hover:bg-red-600 transition-colors flex items-center gap-2">
          <PhoneOff className="h-4 w-4" /> Leave
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function SessionRoom() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [state, setState] = useState<'prejoin' | 'connecting' | 'connected' | 'error'>('prejoin');
  const [tokenData, setTokenData] = useState<TokenResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  // Fetch token from backend
  const fetchToken = useCallback(async () => {
    setState('connecting');
    try {
      const data = await apiFetch(`/livekit/token/${sessionId}`);
      setTokenData(data);
      setState('connected');
    } catch (err: any) {
      setError(err.message || 'Failed to connect to session');
      setState('error');
    }
  }, [sessionId]);

  // Pre-join → fetch token on join click
  const handleJoin = () => { fetchToken(); };

  // Fetch session info for pre-join screen
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch(`/livekit/token/${sessionId}`);
        setSessionInfo(data.session);
        setTokenData(data);
      } catch (err: any) {
        // If not within join window, just show the pre-join screen
        setError(err.message);
      }
    })();
  }, [sessionId]);

  // ── Error State ─────────────────────────────────────────────────────────
  if (state === 'error') {
    return (
      <div className="fixed inset-0 z-50 bg-[#0f172a] flex items-center justify-center p-4">
        <div className="max-w-sm w-full text-center">
          <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Unable to Join</h2>
          <p className="text-white/60 text-sm mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── Connecting State ────────────────────────────────────────────────────
  if (state === 'connecting') {
    return (
      <div className="fixed inset-0 z-50 bg-[#0f172a] flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-[hsl(168,80%,26%)] animate-spin mx-auto mb-4" />
          <p className="text-white/70 text-sm">Connecting to session...</p>
        </div>
      </div>
    );
  }

  // ── Pre-Join State ──────────────────────────────────────────────────────
  if (state === 'prejoin') {
    return <PreJoinScreen onJoin={handleJoin} sessionInfo={sessionInfo} />;
  }

  // ── Connected → LiveKit Room ────────────────────────────────────────────
  if (!tokenData) return null;

  return (
    <LiveKitRoom
      token={tokenData.token}
      serverUrl={tokenData.wsUrl}
      connect={true}
      video={true}
      audio={true}
      onDisconnected={() => {
        router.push(`/student/courses/${params.courseId}/feedback`);
      }}
      style={{ height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: 50 }}
    >
      <VideoStage
        sessionInfo={tokenData.session}
        showChat={showChat}
        setShowChat={setShowChat}
      />
    </LiveKitRoom>
  );
}
