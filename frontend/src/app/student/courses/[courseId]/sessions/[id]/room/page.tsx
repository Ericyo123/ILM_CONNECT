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
  Monitor, X, ChevronRight, ChevronLeft, Loader2, Camera, AlertTriangle,
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
function PreJoinScreen({ onJoin, onBack, sessionInfo }: { onJoin: (mic: boolean, cam: boolean) => void; onBack: () => void; sessionInfo: SessionInfo | null }) {
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
    <div className="fixed inset-0 z-50 bg-[hsl(var(--background))] flex items-center justify-center p-4 overflow-hidden selection:bg-[hsl(168,80%,26%)] selection:text-white">
      
      {/* ─── Premium Ambient Background ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle dot/grid texture */}
        <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--muted-foreground))_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.05] dark:opacity-[0.08]" />
        
        {/* Fullscreen Mosque Silhouette */}
        <div className="absolute bottom-0 left-0 w-full h-[60vh] flex items-end justify-center">
          <svg 
            className="w-[150vw] min-w-[1200px] text-[hsl(168,80%,26%)] opacity-[0.06] dark:opacity-[0.08]" 
            viewBox="0 0 1000 300" 
            preserveAspectRatio="xMidYMax meet" 
            fill="currentColor"
          >
            {/* Base Ground */}
            <rect x="-100" y="290" width="1200" height="10" rx="5" />
            
            {/* Main Onion Dome */}
            <path d="M 400 290 L 400 230 C 340 160, 480 120, 500 80 C 520 120, 660 160, 600 230 L 600 290 Z" />
            {/* Main Spire & Crescent */}
            <rect x="498" y="30" width="4" height="50" />
            <circle cx="500" cy="25" r="4" />
            <path d="M 500 5 A 12 12 0 1 0 512 17 A 9 9 0 1 1 500 5 Z" />

            {/* Left Minaret */}
            <rect x="250" y="140" width="24" height="150" />
            <rect x="246" y="220" width="32" height="6" rx="3" />
            <rect x="246" y="160" width="32" height="6" rx="3" />
            <path d="M 250 140 C 240 110, 260 100, 262 75 C 264 100, 284 110, 274 140 Z" />
            <rect x="261" y="55" width="2" height="20" />
            <circle cx="262" cy="52" r="3" />
            <path d="M 262 38 A 6 6 0 1 0 268 44 A 4.5 4.5 0 1 1 262 38 Z" />

            {/* Right Minaret */}
            <rect x="726" y="140" width="24" height="150" />
            <rect x="722" y="220" width="32" height="6" rx="3" />
            <rect x="722" y="160" width="32" height="6" rx="3" />
            <path d="M 726 140 C 716 110, 736 100, 738 75 C 740 100, 760 110, 750 140 Z" />
            <rect x="737" y="55" width="2" height="20" />
            <circle cx="738" cy="52" r="3" />
            <path d="M 738 38 A 6 6 0 1 0 744 44 A 4.5 4.5 0 1 1 738 38 Z" />

            {/* Left Small Onion Dome */}
            <path d="M 320 290 L 320 250 C 295 210, 350 190, 355 160 C 360 190, 415 210, 390 250 L 390 290 Z" />
            <rect x="354" y="140" width="2" height="20" />
            <circle cx="355" cy="138" r="2" />

            {/* Right Small Onion Dome */}
            <path d="M 610 290 L 610 250 C 585 210, 640 190, 645 160 C 650 190, 705 210, 680 250 L 680 290 Z" />
            <rect x="644" y="140" width="2" height="20" />
            <circle cx="645" cy="138" r="2" />

            {/* Arch Windows */}
            <path d="M 450 260 L 450 220 C 450 210, 470 210, 470 220 L 470 260 Z" opacity="0.2" />
            <path d="M 490 260 L 490 210 C 490 200, 510 200, 510 210 L 510 260 Z" opacity="0.2" />
            <path d="M 530 260 L 530 220 C 530 210, 550 210, 550 220 L 550 260 Z" opacity="0.2" />

            {/* Stars */}
            <path d="M 150 80 L 153 92 L 165 92 L 155 99 L 158 111 L 150 103 L 142 111 L 145 99 L 135 92 L 147 92 Z" opacity="0.4" />
            <path d="M 850 60 L 852 68 L 860 68 L 854 73 L 856 81 L 850 76 L 844 81 L 846 73 L 840 68 L 848 68 Z" opacity="0.4" />
            <path d="M 290 50 L 291 55 L 296 55 L 292 58 L 293 63 L 290 60 L 287 63 L 288 58 L 284 55 L 289 55 Z" opacity="0.3" />
            <path d="M 680 90 L 681 95 L 686 95 L 682 98 L 683 103 L 680 100 L 677 103 L 678 98 L 674 95 L 679 95 Z" opacity="0.3" />
          </svg>
        </div>

        {/* Soft Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-[hsl(168,80%,26%)] opacity-[0.04] dark:opacity-[0.06] blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] rounded-full bg-[hsl(168,60%,35%)] opacity-[0.04] dark:opacity-[0.06] blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '11s' }} />
        
        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_100%)] opacity-80" />
      </div>
      
      {/* ─── Top Navigation ─── */}
      <div className="absolute top-6 left-6 z-20">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--foreground))/0.05] backdrop-blur-md border border-transparent hover:border-[hsl(var(--border))] transition-all duration-300"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
          Back to Course
        </button>
      </div>

      {/* ─── Main Content Card ─── */}
      <div className="max-w-xl w-full relative z-10 flex flex-col items-center">
        
        {/* Header Section */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[hsl(168,80%,26%)/0.1] text-[hsl(168,80%,26%)] mb-2 ring-1 ring-[hsl(168,80%,26%)/0.2]">
            <Camera className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-tight">Ready to Join?</h1>
          {sessionInfo && (
            <p className="text-[hsl(var(--muted-foreground))] text-base flex items-center justify-center gap-2">
              Session with <span className="font-semibold text-[hsl(var(--foreground))] px-3 py-1 rounded-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))]">{sessionInfo.lecturerName}</span>
            </p>
          )}
        </div>

        {/* Video Preview Container (Glassmorphism) */}
        <div className="w-full relative aspect-video bg-black/90 rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-2xl shadow-[hsl(168,80%,26%)/0.15] mb-8 transition-transform duration-500 hover:scale-[1.02]">
          {camEnabled ? (
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transition-opacity duration-700" style={{ transform: 'scaleX(-1)' }} />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-black/80 to-[#0f172a]/90 backdrop-blur-xl">
              <div className="relative flex items-center justify-center h-24 w-24 rounded-full bg-white/5 border border-white/10 mb-4 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
                <VideoOff className="h-10 w-10 text-white/30" />
                {/* Decorative orbit */}
                <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-[spin_10s_linear_infinite]" />
              </div>
              <p className="text-white/60 font-medium tracking-wide text-sm uppercase">Camera is Off</p>
            </div>
          )}

          {/* AV Controls Floating Overlay */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-4 p-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-xl">
            <button 
              onClick={toggleMic} 
              className={`group relative h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-300 ${micEnabled ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500/90 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)]'}`}
            >
              {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-black/80 text-white text-xs px-2 py-1 rounded">Mic</span>
            </button>
            <button 
              onClick={toggleCam} 
              className={`group relative h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-300 ${camEnabled ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500/90 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)]'}`}
            >
              {camEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-black/80 text-white text-xs px-2 py-1 rounded">Cam</span>
            </button>
          </div>
        </div>

        {/* Join Button */}
        <button
          onClick={() => onJoin(micEnabled, camEnabled)}
          className="group w-full py-4 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,65%,40%)] hover:from-[hsl(168,85%,22%)] hover:to-[hsl(168,70%,35%)] shadow-lg shadow-[hsl(168,80%,26%)/0.3] hover:shadow-[hsl(168,80%,26%)/0.5] transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden relative"
        >
          {/* Button Shine Effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
          Join Session Now
          <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
        
        <p className="mt-4 text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1.5 opacity-70">
          <Wifi className="h-3.5 w-3.5" /> End-to-end encrypted connection
        </p>

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
  const [initialMic, setInitialMic] = useState(true);
  const [initialCam, setInitialCam] = useState(true);

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
  const handleJoin = (mic: boolean, cam: boolean) => {
    setInitialMic(mic);
    setInitialCam(cam);
    fetchToken();
  };

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
      <div className="fixed inset-0 z-50 bg-[hsl(var(--background))] flex items-center justify-center p-4">
        <div className="max-w-sm w-full text-center">
          <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-[hsl(var(--foreground))] mb-2">Unable to Join</h2>
          <p className="text-[hsl(var(--muted-foreground))] text-sm mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)] hover:shadow-lg transition-colors"
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
      <div className="fixed inset-0 z-50 bg-[hsl(var(--background))] flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-[hsl(168,80%,26%)] animate-spin mx-auto mb-4" />
          <p className="text-[hsl(var(--muted-foreground))] text-sm">Connecting to session...</p>
        </div>
      </div>
    );
  }

  // ── Pre-Join State ──────────────────────────────────────────────────────
  if (state === 'prejoin') {
    return <PreJoinScreen onJoin={handleJoin} onBack={() => router.back()} sessionInfo={sessionInfo} />;
  }

  // ── Connected → LiveKit Room ────────────────────────────────────────────
  if (!tokenData) return null;

  return (
    <LiveKitRoom
      token={tokenData.token}
      serverUrl={tokenData.wsUrl}
      connect={true}
      video={initialCam}
      audio={initialMic}
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
