import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyberpunk Dreams',
    artist: 'Neon AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/cyberpunk/400/400',
  },
  {
    id: '2',
    title: 'Synthwave Echoes',
    artist: 'Retro Future',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/synthwave/400/400',
  },
  {
    id: '3',
    title: 'Midnight Drive',
    artist: 'Digital Ghost',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/midnight/400/400',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleTrackEnd = () => {
    skipForward();
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-[400px] bg-black/40 backdrop-blur-md rounded-3xl p-6 neon-border flex flex-col gap-6">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 group">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-110' : 'scale-100'}`}
            referrerPolicy="no-referrer"
          />
          <div className={`absolute inset-0 bg-neon-blue/20 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
             <Music className="text-neon-blue animate-pulse" size={24} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white truncate neon-text-blue">{currentTrack.title}</h3>
          <p className="text-sm text-gray-400 truncate uppercase tracking-widest font-mono">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-neon-blue neon-bg-blue"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-500 font-mono uppercase tracking-tighter">
          <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
          <span>{audioRef.current ? formatTime(audioRef.current.duration) : '0:00'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button className="text-gray-500 hover:text-neon-pink transition-colors">
          <Volume2 size={20} />
        </button>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={skipBackward}
            className="text-white hover:text-neon-blue transition-colors"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-neon-blue flex items-center justify-center text-black hover:scale-105 transition-transform neon-bg-blue"
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>
          
          <button 
            onClick={skipForward}
            className="text-white hover:text-neon-blue transition-colors"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>

        <div className="w-5" /> {/* Spacer */}
      </div>
    </div>
  );
};

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
