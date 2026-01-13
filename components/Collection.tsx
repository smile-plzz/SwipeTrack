import React, { useState } from 'react';
import { CollectionItem } from '../types';
import { Search, Star, Filter, Bookmark, Shuffle, Zap } from 'lucide-react';

interface CollectionProps {
  collection: CollectionItem[];
  onRateClick: (item: CollectionItem) => void;
  onItemClick: (item: CollectionItem) => void;
}

const Collection: React.FC<CollectionProps> = ({ collection, onRateClick, onItemClick }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isShuffling, setIsShuffling] = useState(false);

  const backlog = collection.filter(i => i.status === 'backlog');

  const handleSurpriseMe = () => {
    if (backlog.length === 0) return;
    setIsShuffling(true);
    setTimeout(() => {
        const random = backlog[Math.floor(Math.random() * backlog.length)];
        onItemClick(random);
        setIsShuffling(false);
    }, 800);
  };

  const filtered = collection.filter(item => {
     const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
     const matchesFilter = filter === 'all' 
        ? true 
        : filter === 'unrated' 
        ? item.userRating === 0 && item.status === 'watched'
        : filter === 'priority'
        ? item.priority
        : item.status === filter;
     return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 h-full flex flex-col relative">
       {/* Search & Header */}
       <div className="mb-6 space-y-4">
          <div className="relative group">
             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-brand-500 transition-colors" size={18} />
             <input 
                type="text" 
                placeholder="Find in your journal..." 
                className="w-full bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-[1.5rem] py-4 pl-12 pr-4 text-white focus:outline-none focus:border-brand-500 placeholder-gray-500 font-sans transition-all focus:bg-dark-800"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
             />
          </div>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
             {['all', 'priority', 'watched', 'backlog', 'unrated'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black whitespace-nowrap capitalize transition-all border uppercase tracking-widest ${
                      filter === f 
                      ? 'bg-white text-black border-white shadow-xl scale-105' 
                      : 'bg-dark-800/40 text-gray-500 border-dark-700/50 hover:border-gray-500'
                  }`}
                >
                  {f}
                </button>
             ))}
          </div>
       </div>

       {/* Grid/List */}
       <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
          {filtered.length === 0 ? (
             <div className="text-center text-gray-600 mt-20 flex flex-col items-center">
                <Filter size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-bold uppercase tracking-widest">Workspace Empty</p>
                <p className="text-xs mt-1">Start swiping cards to build your database.</p>
             </div>
          ) : (
            <div className="space-y-4">
               {filtered.map(item => (
                 <div 
                    key={item.id} 
                    onClick={() => onItemClick(item)}
                    className={`bg-dark-800/40 backdrop-blur-sm rounded-[1.8rem] overflow-hidden border flex h-32 relative group transition-all hover:border-brand-500/50 cursor-pointer active:scale-[0.98] ${
                     item.priority ? 'border-amber-500/30 bg-amber-500/5 shadow-[inset_0_0_30px_rgba(245,158,11,0.05)]' : 'border-dark-700/50 shadow-sm'
                 }`}
                 >
                    {/* Poster */}
                    <div className="w-24 shrink-0 bg-dark-900 relative overflow-hidden">
                       <img src={item.poster} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                       {item.priority && (
                           <div className="absolute top-2 left-2 bg-amber-500 text-black p-1 rounded-full shadow-lg">
                               <Bookmark size={10} fill="currentColor" />
                           </div>
                       )}
                    </div>
                    
                    {/* Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between overflow-hidden">
                       <div className="min-w-0">
                           <div className="flex justify-between items-start gap-2">
                                <h4 className={`text-base font-black truncate leading-tight ${item.priority ? 'text-amber-100' : 'text-white'}`}>
                                    {item.title}
                                </h4>
                                <span className={`shrink-0 text-[8px] px-2 py-1 rounded-full uppercase tracking-widest font-black ${
                                    item.status === 'watched' ? 'bg-green-500/10 text-green-400' : 
                                    item.status === 'backlog' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-500'
                                }`}>
                                    {item.status}
                                </span>
                           </div>
                           <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-1 font-black uppercase tracking-widest">
                               {item.year} • {item.type}
                           </p>
                       </div>

                       <div className="flex items-center justify-between">
                            {/* Rating Display or Action */}
                            {item.status === 'watched' ? (
                                item.userRating > 0 ? (
                                    <div className="flex items-center gap-1 text-yellow-500 text-xs font-black bg-yellow-500/10 px-3 py-1.5 rounded-xl border border-yellow-500/20">
                                        <Star size={12} fill="currentColor" /> {item.userRating}
                                    </div>
                                ) : (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onRateClick(item); }}
                                        className="flex items-center gap-2 text-gray-400 hover:text-white text-[10px] bg-dark-700/50 hover:bg-brand-500 px-3 py-1.5 rounded-xl transition-all font-black uppercase tracking-widest border border-dark-600"
                                    >
                                        <Star size={12} /> Rate Now
                                    </button>
                                )
                            ) : (
                                <div className="text-[9px] text-gray-600 font-black uppercase tracking-tighter">
                                    Added {new Date(item.dateAdded).toLocaleDateString([], {month: 'short', day: 'numeric'})}
                                </div>
                            )}
                            
                            {/* Runtime */}
                            <div className="text-[9px] text-gray-500 border border-dark-600/50 px-2 py-1 rounded-lg bg-dark-900/50 font-black uppercase tracking-widest">
                                {item.runtime || 'N/A'}
                            </div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          )}
       </div>

       {/* Surprise Me FAB */}
       {backlog.length >= 2 && (
          <button 
            onClick={handleSurpriseMe}
            disabled={isShuffling}
            className={`fixed bottom-24 right-6 w-14 h-14 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-[0_10px_30px_rgba(99,102,241,0.4)] transition-all hover:scale-110 active:scale-90 z-[60] border-4 border-dark-900 group ${isShuffling ? 'animate-spin' : ''}`}
          >
            {isShuffling ? <Shuffle size={24} /> : <Zap size={24} fill="currentColor" className="group-hover:rotate-12 transition-transform" />}
            
            {/* Label Tooltip */}
            <div className="absolute right-16 px-4 py-2 bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
               Surprise Me
            </div>
          </button>
       )}
    </div>
  );
};

export default Collection;