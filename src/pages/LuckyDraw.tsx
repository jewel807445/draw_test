import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Settings, Play, RefreshCw, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export default function LuckyDraw() {
  const { names } = useApp();
  const [winners, setWinners] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState('???');
  const [drawCount, setDrawCount] = useState(1);
  const [allowRepeats, setAllowRepeats] = useState(false);
  
  // Pool of names available to draw from
  const availableNames = allowRepeats 
    ? names 
    : names.filter(n => !winners.includes(n));

  const handleDraw = () => {
    if (availableNames.length === 0) return;
    if (isDrawing) return;

    setIsDrawing(true);
    
    // Animation logic
    let counter = 0;
    const duration = 2000; // 2 seconds spin
    const intervalTime = 50;
    
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableNames.length);
      setCurrentDisplay(availableNames[randomIndex]);
      counter += intervalTime;

      if (counter >= duration) {
        clearInterval(interval);
        finalizeDraw();
      }
    }, intervalTime);
  };

  const finalizeDraw = () => {
    // Select N unique winners from available
    const countToDraw = Math.min(drawCount, availableNames.length);
    const newWinners: string[] = [];
    const tempPool = [...availableNames];

    for (let i = 0; i < countToDraw; i++) {
      if (tempPool.length === 0) break;
      const randomIndex = Math.floor(Math.random() * tempPool.length);
      const winner = tempPool[randomIndex];
      newWinners.push(winner);
      tempPool.splice(randomIndex, 1); // Remove from temp pool to avoid picking same person twice in one batch
    }

    setWinners(prev => [...newWinners, ...prev]); // Add to top
    setCurrentDisplay(newWinners.join(', '));
    setIsDrawing(false);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const clearWinners = () => {
    setWinners([]);
    setCurrentDisplay('???');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Settings Panel */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="w-5 h-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Draw Count
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={drawCount}
                onChange={(e) => setDrawCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="allowRepeats"
                checked={allowRepeats}
                onChange={(e) => setAllowRepeats(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="allowRepeats" className="text-sm text-gray-700">
                Allow Repeats
              </label>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-500 mb-2">
                Available: {availableNames.length} / {names.length}
              </div>
              <Button 
                onClick={clearWinners} 
                variant="outline" 
                size="sm" 
                className="w-full"
                disabled={winners.length === 0}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Winners
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Draw Area */}
        <Card className="md:col-span-2 flex flex-col">
          <CardContent className="flex-1 flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={isDrawing ? 'drawing' : 'result-' + winners.length}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="mb-8"
              >
                <h2 className="text-5xl md:text-6xl font-bold text-indigo-600 tracking-tight">
                  {currentDisplay}
                </h2>
              </motion.div>
            </AnimatePresence>

            <Button 
              size="lg" 
              onClick={handleDraw} 
              disabled={isDrawing || availableNames.length === 0}
              className="px-12 py-6 text-xl rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              {isDrawing ? 'Drawing...' : 'Start Draw'}
              {!isDrawing && <Play className="ml-2 w-6 h-6" />}
            </Button>

            {availableNames.length === 0 && names.length > 0 && !isDrawing && (
              <p className="mt-4 text-red-500 font-medium">
                No more names to draw!
              </p>
            )}
            {names.length === 0 && (
              <p className="mt-4 text-gray-400">
                Please add names in the "Data Input" tab first.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Winners History */}
      {winners.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Winners History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {winners.map((winner, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-full font-medium flex items-center gap-2"
                >
                  <span className="text-xs opacity-50">#{winners.length - idx}</span>
                  {winner}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
