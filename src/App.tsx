import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-pink/10 rounded-full blur-[120px]" />
      
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-center relative z-10">
        {/* Left Column: Game */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center justify-center"
        >
          <div className="mb-8 text-center">
            <h1 className="text-6xl font-black tracking-tighter uppercase italic text-white neon-text-blue mb-2">
              NEON <span className="text-neon-pink neon-text-pink">SNAKE</span>
            </h1>
            <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.4em]">Retro Arcade Experience</p>
          </div>
          
          <SnakeGame />
        </motion.section>

        {/* Right Column: Music Player & Info */}
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col gap-8"
        >
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-neon-blue">Now Playing</h2>
            <MusicPlayer />
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">How to Play</h3>
            <ul className="text-xs text-gray-400 space-y-2 font-mono uppercase leading-relaxed">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-blue" />
                Eat pink dots to grow
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-pink" />
                Avoid hitting yourself
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                Score high to unlock vibes
              </li>
            </ul>
          </div>
          
          <div className="mt-auto pt-8 border-t border-white/5 flex justify-between items-center">
             <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
               v1.0.4-stable
             </div>
             <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse [animation-delay:200ms]" />
                <div className="w-2 h-2 rounded-full bg-neon-pink animate-pulse [animation-delay:400ms]" />
             </div>
          </div>
        </motion.section>
      </main>

      {/* Decorative Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-20" 
           style={{ 
             backgroundImage: 'radial-gradient(circle, #ffffff10 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }} 
      />
    </div>
  );
}
