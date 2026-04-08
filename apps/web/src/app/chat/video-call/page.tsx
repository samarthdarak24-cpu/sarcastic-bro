'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Video, VideoOff, Mic, MicOff, PhoneOff, Monitor, Settings,
  MessageSquare, Users, Grid, Maximize2, Camera, Volume2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function VideoCallPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('conversation');
  
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Simulate connection
    setTimeout(() => {
      setIsConnecting(false);
      toast.success('Connected to video call');
      startLocalVideo();
    }, 2000);

    // Start call timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      stopLocalVideo();
    };
  }, []);

  const startLocalVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast.error('Could not access camera/microphone');
    }
  };

  const stopLocalVideo = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => {
        track.enabled = !videoEnabled;
      });
    }
    toast.success(videoEnabled ? 'Camera off' : 'Camera on');
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => {
        track.enabled = !audioEnabled;
      });
    }
    toast.success(audioEnabled ? 'Microphone off' : 'Microphone on');
  };

  const toggleScreenShare = async () => {
    if (!screenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setScreenSharing(true);
        toast.success('Screen sharing started');
      } catch (error) {
        toast.error('Could not start screen sharing');
      }
    } else {
      startLocalVideo();
      setScreenSharing(false);
      toast.success('Screen sharing stopped');
    }
  };

  const endCall = () => {
    stopLocalVideo();
    toast.success('Call ended');
    router.push('/chat');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
              R
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Ramesh Kumar</h3>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 text-sm">{formatDuration(callDuration)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowChat(!showChat)}
              className="h-10 px-4 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white rounded-xl transition-all flex items-center gap-2"
            >
              <MessageSquare size={18} />
              <span className="text-sm font-medium">Chat</span>
            </button>
            <button className="h-10 px-4 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white rounded-xl transition-all flex items-center gap-2">
              <Users size={18} />
              <span className="text-sm font-medium">2</span>
            </button>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="relative h-screen flex items-center justify-center p-6">
        {isConnecting ? (
          <div className="text-center">
            <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Video size={40} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Connecting...</h3>
            <p className="text-slate-400">Please wait while we connect you</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-7xl">
            {/* Remote Video */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video bg-slate-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-5xl mx-auto mb-4">
                    R
                  </div>
                  <p className="text-white font-bold text-xl">Ramesh Kumar</p>
                  <p className="text-slate-400 text-sm">Farmer • Maharashtra</p>
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-lg px-3 py-1 rounded-lg">
                <span className="text-white text-sm font-medium">Ramesh Kumar</span>
              </div>
            </motion.div>

            {/* Local Video */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative aspect-video bg-slate-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />
              {!videoEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                  <div className="text-center">
                    <div className="h-32 w-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-5xl mx-auto mb-4">
                      Y
                    </div>
                    <p className="text-white font-bold text-xl">You</p>
                  </div>
                </div>
              )}
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-lg px-3 py-1 rounded-lg">
                <span className="text-white text-sm font-medium">You</span>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl border border-white/20">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={toggleVideo}
                className={`h-14 w-14 rounded-full flex items-center justify-center transition-all ${
                  videoEnabled
                    ? 'bg-slate-700 hover:bg-slate-600'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                title={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
              >
                {videoEnabled ? (
                  <Video size={24} className="text-white" />
                ) : (
                  <VideoOff size={24} className="text-white" />
                )}
              </button>

              <button
                onClick={toggleAudio}
                className={`h-14 w-14 rounded-full flex items-center justify-center transition-all ${
                  audioEnabled
                    ? 'bg-slate-700 hover:bg-slate-600'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                title={audioEnabled ? 'Mute microphone' : 'Unmute microphone'}
              >
                {audioEnabled ? (
                  <Mic size={24} className="text-white" />
                ) : (
                  <MicOff size={24} className="text-white" />
                )}
              </button>

              <button
                onClick={toggleScreenShare}
                className={`h-14 w-14 rounded-full flex items-center justify-center transition-all ${
                  screenSharing
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title={screenSharing ? 'Stop sharing' : 'Share screen'}
              >
                <Monitor size={24} className="text-white" />
              </button>

              <button
                onClick={endCall}
                className="h-14 px-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center gap-2 transition-all"
                title="End call"
              >
                <PhoneOff size={24} className="text-white" />
                <span className="text-white font-bold">End Call</span>
              </button>

              <button className="h-14 w-14 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center transition-all">
                <Settings size={24} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
}
