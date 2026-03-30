import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Play, RotateCcw } from 'lucide-react';
import { Point, GameStatus } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const SPEED = 150;

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setFood(generateFood(INITIAL_SNAKE));
    setStatus('playing');
  };

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setStatus('gameover');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food is eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood]);

  useEffect(() => {
    if (status === 'playing') {
      gameLoopRef.current = setInterval(moveSnake, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [status, moveSnake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] px-4">
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-gray-500">Score</span>
          <span className="text-2xl font-mono text-neon-green neon-text-green">{score}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-gray-500">Best</span>
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-neon-pink" />
            <span className="text-2xl font-mono text-neon-pink neon-text-pink">{highScore}</span>
          </div>
        </div>
      </div>

      <div 
        className="relative bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden neon-border"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Snake segments */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${segment.x}-${segment.y}-${i}`}
            layoutId={`snake-${i}`}
            className={`absolute rounded-sm ${i === 0 ? 'bg-neon-blue neon-bg-blue z-10' : 'bg-neon-blue/60'}`}
            style={{
              width: 20,
              height: 20,
              left: segment.x * 20,
              top: segment.y * 20,
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute bg-neon-pink neon-bg-pink rounded-full"
          style={{
            width: 14,
            height: 14,
            left: food.x * 20 + 3,
            top: food.y * 20 + 3,
          }}
        />

        <AnimatePresence>
          {status !== 'playing' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-20"
            >
              {status === 'idle' && (
                <div className="text-center p-8">
                  <h2 className="text-4xl font-bold mb-6 neon-text-blue text-neon-blue uppercase tracking-tighter">Neon Snake</h2>
                  <button 
                    onClick={() => setStatus('playing')}
                    className="group relative px-8 py-3 bg-transparent border border-neon-blue text-neon-blue rounded-full overflow-hidden transition-all hover:bg-neon-blue hover:text-black"
                  >
                    <span className="relative z-10 flex items-center gap-2 font-bold uppercase tracking-widest">
                      <Play size={20} fill="currentColor" /> Start Game
                    </span>
                  </button>
                </div>
              )}
              {status === 'gameover' && (
                <div className="text-center p-8">
                  <h2 className="text-4xl font-bold mb-2 neon-text-pink text-neon-pink uppercase tracking-tighter">Game Over</h2>
                  <p className="text-gray-400 mb-8 uppercase tracking-widest text-sm">Final Score: {score}</p>
                  <button 
                    onClick={resetGame}
                    className="group relative px-8 py-3 bg-transparent border border-neon-pink text-neon-pink rounded-full overflow-hidden transition-all hover:bg-neon-pink hover:text-black"
                  >
                    <span className="relative z-10 flex items-center gap-2 font-bold uppercase tracking-widest">
                      <RotateCcw size={20} /> Try Again
                    </span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-mono">
        Use Arrow Keys to Navigate
      </div>
    </div>
  );
};
