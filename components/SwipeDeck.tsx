import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';
import { MediaItem, SwipeDirection } from '../types';
import MediaCard from './MediaCard';
import { X, Check, Clock, RefreshCw, Loader2, ArrowDown, ArrowUp } from 'lucide-react';

interface SwipeDeckProps {
  items: MediaItem[];
  onSwipe: (item: MediaItem, direction: SwipeDirection) => void;
  onCardClick: (item: MediaItem) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

const SwipeDeck: React.FC<SwipeDeckProps> = ({ items, onSwipe, onCardClick, onRefresh, isLoading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const currentItem = items[currentIndex];
  const nextItem = items[currentIndex + 1];

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const controls = useAnimation();

  // Visual feedback opacities
  const nopeOpacity = useTransform(x, [-150, -20], [1, 0]); // Left (Skip)
  const likeOpacity = useTransform(x, [20, 150], [0, 1]);   // Right (Journal)
  const watchLaterOpacity = useTransform(y, [50, 150], [0, 1]); // Down (Watch Later)
  const priorityOpacity = useTransform(y, [-150, -50], [1, 0]); // Up (Priority)
  
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);

  const handleDragEnd = async (_: any, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    const velocityY = info.velocity.y;

    if (info.offset.y > threshold) {
       // Swipe DOWN (Watch Later / Backlog)
       await controls.start({ y: 800, transition: { duration: 0.4 } });
       handleSwipeComplete('down');
    } else if (info.offset.y < -threshold) {
       // Swipe UP (Priority Backlog)
       await controls.start({ y: -800, transition: { duration: 0.4 } });
       handleSwipeComplete('up');
    } else if (info.offset.x > threshold || velocity > 500) {
      // Swipe Right (Watched)
      await controls.start({ x: 500, rotate: 20, opacity: 0, transition: { duration: 0.3 } });
      handleSwipeComplete('right');
    } else if (info.offset.x < -threshold || velocity < -500) {
      // Swipe Left (Skip)
      await controls.start({ x: -500, rotate: -20, opacity: 0, transition: { duration: 0.3 } });
      handleSwipeComplete('left');
    } else {
      // Reset
      controls.start({ x: 0, y: 0, opacity: 1, rotate: 0 });
    }
  };

  const handleSwipeComplete = (direction: SwipeDirection) => {
    if (currentItem) {
      onSwipe(currentItem, direction);
    }
    // Reset position instantly for the next card
    x.set(0);
    y.set(0);
    setCurrentIndex((prev) => prev + 1);
  };

  const manualSwipe = async (dir: SwipeDirection) => {
    if (dir === 'left') {
      await controls.start({ x: -500, rotate: -30, transition: { duration: 0.3 } });
    } else if (dir === 'right') {
      await controls.start({ x: 500, rotate: 30, transition: { duration: 0.3 } });
    } else if (dir === 'down') {
      await controls.start({ y: 800, transition: { duration: 0.3 } });
    } else if (dir === 'up') {
      await controls.start({ y: -800, transition: { duration: 0.3 } });
    }
    handleSwipeComplete(dir);
  };

  if (isLoading && !currentItem) {
     return (
       <div className="flex flex-col items-center justify-center h-full">
         <Loader2 className="animate-spin text-brand-500 mb-2" size={48} />
         <p className="text-gray-400 text-sm">Loading deck...</p>
       </div>
     );
  }

  if (!currentItem) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-400">
        <div className="w-20 h-20 bg-dark-700 rounded-full flex items-center justify-center mb-4 animate-float">
           <RefreshCw size={32} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Deck Empty</h3>
        <p className="text-sm">We've run out of cards for this category.</p>
        <button 
          onClick={() => { setCurrentIndex(0); onRefresh(); }}
          className="mt-6 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-full font-semibold transition-colors flex items-center gap-2"
        >
          <RefreshCw size={18} /> Load More
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full max-w-md mx-auto flex flex-col justify-center items-center">
      
      {/* Cards Container */}
      <div className="relative w-full h-[65vh] md:h-[70vh]">
        {/* Next Card (Background) */}
        {nextItem && (
          <div className="absolute top-0 left-0 w-full h-full transform scale-95 translate-y-4 opacity-60 z-30">
             <MediaCard item={nextItem} index={1} />
          </div>
        )}

        {/* Current Card (Draggable) */}
        <motion.div
            style={{ x, y, rotate, scale }}
            animate={controls}
            className="absolute top-0 left-0 w-full h-full z-40 touch-none"
        >
             <MediaCard 
                item={currentItem} 
                drag={true}
                onDragEnd={handleDragEnd}
                onClick={() => onCardClick(currentItem)}
                index={0}
             />

             {/* Dynamic Overlays */}
             <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 bg-green-500 text-white rounded-lg px-4 py-2 text-xl font-bold uppercase tracking-widest pointer-events-none shadow-xl">
                Journal
             </motion.div>

             <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 right-8 bg-gray-500 text-white rounded-lg px-4 py-2 text-xl font-bold uppercase tracking-widest pointer-events-none shadow-xl">
                Skip
             </motion.div>

             <motion.div style={{ opacity: watchLaterOpacity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-blue-500 text-white rounded-lg px-4 py-2 text-xl font-bold uppercase tracking-widest pointer-events-none shadow-xl whitespace-nowrap">
                 Watch Later
             </motion.div>

             <motion.div style={{ opacity: priorityOpacity }} className="absolute top-8 left-1/2 -translate-x-1/2 bg-amber-500 text-black rounded-lg px-4 py-2 text-xl font-bold uppercase tracking-widest pointer-events-none shadow-xl whitespace-nowrap">
                 Priority
             </motion.div>
        </motion.div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-6 mt-8 z-50">
        <button 
          onClick={() => manualSwipe('left')}
          className="w-14 h-14 bg-dark-800 rounded-full flex items-center justify-center text-gray-400 shadow-lg border border-dark-700 hover:scale-110 hover:bg-gray-800 transition-all group"
        >
          <X size={24} strokeWidth={3} className="group-hover:text-red-500 transition-colors" />
        </button>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => manualSwipe('up')}
            className="w-10 h-10 bg-dark-800 rounded-full flex items-center justify-center text-amber-500 shadow-lg border border-dark-700 hover:scale-110 hover:bg-amber-500/10 transition-all"
          >
            <ArrowUp size={20} strokeWidth={3} />
          </button>
          <button 
            onClick={() => manualSwipe('down')}
            className="w-10 h-10 bg-dark-800 rounded-full flex items-center justify-center text-blue-400 shadow-lg border border-dark-700 hover:scale-110 hover:bg-blue-500/10 transition-all"
          >
            <ArrowDown size={20} strokeWidth={3} />
          </button>
        </div>

        <button 
          onClick={() => manualSwipe('right')}
          className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black shadow-lg border border-white hover:scale-110 hover:bg-gray-200 transition-all group"
        >
          <Check size={28} strokeWidth={3} className="text-black" />
        </button>
      </div>
      <div className="text-[10px] text-gray-500 mt-4 font-bold uppercase tracking-widest flex gap-4">
        <span>↓ Later</span>
        <span>↑ Priority</span>
      </div>
    </div>
  );
};

export default SwipeDeck;