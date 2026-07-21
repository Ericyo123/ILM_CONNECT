'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mic, MicOff, Video, VideoOff, MessageSquare, Hand, 
  Smile, PhoneOff, Maximize, Settings, Presentation, 
  PenTool, Focus, Award, ChevronRight, X, CheckCircle
} from 'lucide-react';
import Image from 'next/image';

export default function SessionRoom({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [activeFeature, setActiveFeature] = useState<'video' | 'whiteboard' | 'makharij'>('video');
  const [confetti, setConfetti] = useState(false);
  const [teacherFeedback, setTeacherFeedback] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Sheikh Ahmed (Lecturer)', text: 'Assalamu Alaikum! Are you ready to begin?', time: '14:00' }
  ]);

  // Simulate a reward triggered by teacher
  useEffect(() => {
    const timer = setTimeout(() => {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 4000);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleLeave = () => {
    router.push('/student/courses/beginner-qaida/feedback'); // Feedback page
  };

  const triggerTeacherFeedback = (text: string) => {
    setTeacherFeedback(text);
    setTimeout(() => setTeacherFeedback(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a] text-white flex flex-col h-screen overflow-hidden">
      
      {/* Header */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0f172a]/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
          <h1 className="font-semibold text-lg">Tajweed Review — Surah Al-Baqarah</h1>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-white/10 text-white/70">
            00:15:32
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-xs font-semibold flex items-center gap-1.5">
            <Focus className="h-3.5 w-3.5" /> Excellent Connection
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Center Stage */}
        <div className={`flex-1 relative transition-all duration-300 p-4 ${showChat ? 'mr-[320px]' : ''}`}>
          
          {/* Teacher Feedback Overlay */}
          {teacherFeedback && (
             <div className="absolute top-1/4 left-1/2 -translate-x-1/2 z-[100] flex items-center justify-center pointer-events-none animate-fade-in">
                <div className="px-6 py-3 rounded-full bg-blue-500/90 text-white font-bold text-xl shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-blue-400">
                  {teacherFeedback}
                </div>
             </div>
          )}

          {/* Confetti Animation Overlay */}
          {confetti && (
             <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none">
                <div className="animate-bounce">
                  <div className="text-6xl mb-4 text-center">⭐</div>
                  <h2 className="text-4xl font-bold text-yellow-400 drop-shadow-lg">Mashallah! Excellent!</h2>
                </div>
             </div>
          )}

          <div className="w-full h-full bg-black rounded-2xl overflow-hidden relative border border-white/10 flex flex-col">
            
            {/* View Switching */}
            {activeFeature === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="text-center opacity-40">
                   <Video className="h-16 w-16 mx-auto mb-4" />
                   <p>Lecturer Video Feed</p>
                 </div>
              </div>
            )}

            {activeFeature === 'whiteboard' && (
              <div className="absolute inset-0 bg-white">
                <div className="absolute top-4 left-4 p-2 bg-black/5 rounded-lg">
                   <h3 className="font-bold text-black flex items-center gap-2">
                     <PenTool className="h-4 w-4" /> Shared Qaida Board
                   </h3>
                </div>
                <div className="flex items-center justify-center h-full">
                  <div className="text-8xl font-arabic text-black text-center relative">
                    <span className="text-red-500">بِ</span>سْمِ اللَّهِ
                    {/* Simulated Laser Pointer */}
                    <div className="absolute -left-6 top-10 h-4 w-4 rounded-full bg-red-500/50 animate-ping"></div>
                    <div className="absolute -left-5 top-11 h-2 w-2 rounded-full bg-red-500"></div>
                  </div>
                </div>
              </div>
            )}

            {activeFeature === 'makharij' && (
              <div className="absolute inset-0 flex">
                <div className="w-1/2 h-full border-r border-white/20 bg-[#1e293b] flex flex-col items-center justify-center p-8 relative">
                   <span className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider">Teacher Mouth Shape</span>
                   <div className="w-48 h-48 border-4 border-dashed border-white/30 rounded-full flex items-center justify-center mb-4">
                     Focus Area
                   </div>
                   <p className="text-center text-sm text-white/70 max-w-xs">Observe how the teacher shapes their mouth for the letter &quot;Khaa&quot; (خ)</p>
                </div>
                <div className="w-1/2 h-full bg-black flex flex-col items-center justify-center p-8 relative">
                   <span className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider">Your Mouth Shape</span>
                   <div className="w-48 h-48 border-4 border-green-500 rounded-full flex items-center justify-center mb-4 relative">
                     <div className="absolute -bottom-1 -right-1 bg-green-500 p-1.5 rounded-full"><CheckCircle className="h-4 w-4 text-black" /></div>
                   </div>
                   <p className="text-center text-green-400 text-sm max-w-xs font-medium">Perfect articulation!</p>
                </div>
              </div>
            )}

            {/* Student Picture-in-Picture */}
            <div className="absolute bottom-4 right-4 w-48 aspect-video bg-[#1e293b] rounded-xl border-2 border-white/20 overflow-hidden shadow-2xl z-50">
              <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1.5 z-10">
                 You {micOn ? <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div> : <MicOff className="h-3 w-3 text-red-400" />}
              </div>
              {/* Simulated Waveform for speaking */}
              {micOn && (
                <div className="absolute bottom-2 right-2 flex items-end gap-0.5 h-3 z-10">
                   <div className="w-1 bg-green-500 rounded-full animate-[pulse_1s_ease-in-out_infinite]" style={{ height: '40%' }}></div>
                   <div className="w-1 bg-green-500 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.2s]" style={{ height: '70%' }}></div>
                   <div className="w-1 bg-green-500 rounded-full animate-[pulse_1.2s_ease-in-out_infinite_0.4s]" style={{ height: '100%' }}></div>
                   <div className="w-1 bg-green-500 rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.1s]" style={{ height: '60%' }}></div>
                </div>
              )}
            </div>

            {/* Lecturer Name Label */}
            <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1.5 rounded-lg text-sm font-medium backdrop-blur-sm z-50">
              Sheikh Ahmed (Lecturer)
            </div>
            
            {/* DEMO PURPOSES ONLY: Lecturer Controls */}
            <div className="absolute top-4 right-4 bg-black/80 border border-white/20 p-3 rounded-xl z-[60] backdrop-blur-md max-w-[200px]">
              <div className="text-[10px] font-bold text-white/50 mb-2 uppercase tracking-wider">Demo: Teacher Controls</div>
              <div className="flex flex-wrap gap-1.5">
                {['Excellent!', 'Good work', 'Solid', "That's correct", 'Please try again'].map(msg => (
                  <button 
                    key={msg}
                    onClick={() => triggerTeacherFeedback(msg)}
                    className="px-2 py-1 rounded bg-white/10 hover:bg-[hsl(var(--primary))] text-[10px] font-medium transition-colors"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Sidebar */}
        <div className={`absolute top-0 right-0 h-full w-[320px] bg-[#1e293b] border-l border-white/10 flex flex-col transition-transform duration-300 ${showChat ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Chat & Notes</h2>
            <button onClick={() => setShowChat(false)} className="p-1 hover:bg-white/10 rounded-md transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {chatMessages.map(msg => (
              <div key={msg.id} className="bg-white/5 rounded-xl p-3">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs font-semibold text-[hsl(var(--primary))]">{msg.sender}</span>
                  <span className="text-[10px] text-white/50">{msg.time}</span>
                </div>
                <p className="text-sm text-white/90">{msg.text}</p>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/10 bg-[#0f172a]/50">
            <div className="relative">
              <input type="text" placeholder="Type a message..." className="w-full bg-black/50 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/50 hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Control Bar */}
      <div className="h-20 bg-[#0f172a] border-t border-white/10 flex items-center justify-center px-6 gap-3 z-10">
        
        {/* AV Controls */}
        <div className="flex items-center gap-2 mr-4 border-r border-white/10 pr-6">
          <button onClick={() => setMicOn(!micOn)} className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${micOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500 hover:bg-red-600'}`}>
            {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>
          <button onClick={() => setVideoOn(!videoOn)} className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${videoOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500 hover:bg-red-600'}`}>
            {videoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>
        </div>

        {/* Feature Toggles */}
        <div className="flex items-center gap-2 bg-white/5 rounded-2xl p-1">
          <button onClick={() => setActiveFeature('video')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${activeFeature === 'video' ? 'bg-[hsl(var(--primary))]' : 'hover:bg-white/10'}`}>
            <Video className="h-4 w-4" /> <span className="hidden sm:inline">Camera</span>
          </button>
          <button onClick={() => setActiveFeature('whiteboard')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${activeFeature === 'whiteboard' ? 'bg-[hsl(var(--primary))]' : 'hover:bg-white/10'}`}>
            <Presentation className="h-4 w-4" /> <span className="hidden sm:inline">Qaida Board</span>
          </button>
          <button onClick={() => setActiveFeature('makharij')} disabled className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 opacity-50 cursor-not-allowed ${activeFeature === 'makharij' ? 'bg-[hsl(var(--primary))]' : 'hover:bg-white/10'}`}>
            <Focus className="h-4 w-4" /> <span className="hidden sm:inline">Makharij Mirror</span>
            <span className="absolute -top-2 -right-2 bg-[hsl(var(--accent))] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">Soon</span>
          </button>
        </div>

        {/* Interactions */}
        <div className="flex items-center gap-2 ml-4 border-l border-white/10 pl-6 relative">
          <button onClick={() => setHandRaised(!handRaised)} className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${handRaised ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50' : 'bg-white/10 hover:bg-white/20'}`}>
            <Hand className="h-5 w-5" />
          </button>
          <button onClick={() => setShowReactions(!showReactions)} className="h-12 w-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all">
            <Smile className="h-5 w-5" />
          </button>
          {!showChat && (
            <button onClick={() => setShowChat(true)} className="h-12 w-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all relative">
              <MessageSquare className="h-5 w-5" />
              <div className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-[#0f172a]"></div>
            </button>
          )}

          {/* Reactions Popover */}
          {showReactions && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#1e293b] border border-white/10 rounded-2xl p-2 flex gap-2 shadow-xl animate-fade-in">
              {['👍', '❤️', '👏', '🤔', '🎉'].map(emoji => (
                <button key={emoji} onClick={() => setShowReactions(false)} className="h-10 w-10 text-xl hover:bg-white/10 rounded-xl transition-colors flex items-center justify-center">
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Leave */}
        <button onClick={handleLeave} className="ml-auto px-6 py-2.5 rounded-full text-sm font-semibold bg-red-500 hover:bg-red-600 transition-colors flex items-center gap-2">
          <PhoneOff className="h-4 w-4" /> Leave
        </button>
      </div>

    </div>
  );
}
