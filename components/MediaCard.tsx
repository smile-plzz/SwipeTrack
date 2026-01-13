import React from 'react';
import { MediaItem, CollectionItem } from '../types';
import { Clock, Star, Film, Gamepad2, Tv, Info, Bookmark } from 'lucide-react';
import { motion, PanInfo } from 'framer-motion';

interface MediaCardProps {
  item: MediaItem | CollectionItem;
  style?: React.CSSProperties;
  onDragEnd?: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  onClick?: () => void;
  drag?: boolean | "x" | "y";
  index: number;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, style, onDragEnd, onClick, drag, index }) => {
  
  const Icon = item.type === 'game' ? Gamepad2 : item.type === 'movie' ? Film : Tv;
  const isPriority = 'priority' in item && item.priority;

  return (
    <motion.div
      drag={drag}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={onDragEnd}
      onClick={onClick}
      style={{
        ...style,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transformOrigin: 'top center',
        touchAction: 'none'
      }}
      className={`relative bg-dark-800 rounded-3xl overflow-hidden shadow-2xl border transition-colors select-none cursor-grab active:cursor-grabbing group ${
        index === 0 ? 'z-50' : 'z-40'
      } ${isPriority ? 'border-amber-500/50' : 'border-dark-700'}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={item.poster} 
          alt={item.title} 
          className="w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent" />
      </div>

      {/* Priority Indicator */}
      {isPriority && (
        <div className="absolute top-4 right-4 bg-amber-500 text-black p-1.5 rounded-full shadow-lg z-10 animate-pulse">
          <Bookmark size={16} fill="currentColor" />
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 text-white flex flex-col gap-3 pointer-events-none">
        
        {/* Properties Badge Row */}
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="px-2 py-1 bg-white/10 backdrop-blur-md rounded border border-white/10 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
             <Icon size={10} /> {item.type}
          </span>
          <span className="px-2 py-1 bg-white/10 backdrop-blur-md rounded border border-white/10 text-[10px] font-bold text-gray-300">
             {item.year}
          </span>
          {item.rating && item.rating > 0 && (
             <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 backdrop-blur-md rounded text-[10px] font-bold text-yellow-400 flex items-center gap-1">
              <Star size={10} fill="currentColor" /> {item.rating}
             </span>
          )}
        </div>

        <h2 className="text-3xl font-bold leading-tight shadow-black drop-shadow-lg font-serif">
          {item.title}
        </h2>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 text-sm text-gray-300">
           {item.genre.slice(0, 3).map(g => (
             <span key={g} className="text-[10px] bg-dark-900/80 px-2 py-0.5 rounded text-gray-400">
               #{g}
             </span>
           ))}
        </div>
        
        {item.runtime && (
            <div className="flex items-center gap-1 text-xs text-gray-400 font-mono mt-1">
               <Clock size={12} /> {item.runtime}
            </div>
        )}

        <div className="h-[1px] w-full bg-white/10 my-2" />

        <p className="text-gray-300 line-clamp-3 text-sm leading-relaxed opacity-90 font-sans">
          {item.description}
        </p>

        <div className="pt-4 flex items-center justify-center text-xs text-gray-400 gap-1 opacity-60">
           <Info size={14} /> Tap card for details
        </div>
      </div>

      {/* Overlays for Swipe Actions */}
      <motion.div 
        className="absolute top-10 left-10 bg-green-500/90 text-white rounded-xl px-6 py-2 text-2xl font-bold uppercase -rotate-12 shadow-xl opacity-0 backdrop-blur-sm"
        style={{ opacity: 0 }}
      >
        Journal It
      </motion.div>
      <motion.div 
        className="absolute top-10 right-10 bg-red-500/90 text-white rounded-xl px-6 py-2 text-2xl font-bold uppercase rotate-12 shadow-xl opacity-0 backdrop-blur-sm"
        style={{ opacity: 0 }} 
      >
        Skip
      </motion.div>
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500/90 text-white rounded-xl px-6 py-2 text-2xl font-bold uppercase shadow-xl opacity-0 backdrop-blur-sm text-center"
        style={{ opacity: 0 }} 
      >
        Watch Later
      </motion.div>
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-amber-500/90 text-black rounded-xl px-6 py-2 text-2xl font-bold uppercase shadow-xl opacity-0 backdrop-blur-sm text-center"
        style={{ opacity: 0 }} 
      >
        Priority
      </motion.div>

    </motion.div>
  );
};

export default MediaCard;