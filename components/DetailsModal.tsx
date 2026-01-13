import React from 'react';
import { X, Calendar, Clock, Star, Tag, PlayCircle, BookOpen, Check, ExternalLink, Users, Clapperboard } from 'lucide-react';
import { MediaItem } from '../types';

interface DetailsModalProps {
  item: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: 'watched' | 'backlog' | 'rate') => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ item, isOpen, onClose, onAction }) => {
  if (!isOpen || !item) return null;

  // Mock cast based on item type
  const cast = item.type === 'game' 
    ? ["Troy Baker", "Ashley Johnson", "Laura Bailey"] 
    : ["Cillian Murphy", "Robert Downey Jr.", "Florence Pugh"];

  const watchUrl = `https://cine-gemini.vercel.app/search?q=${encodeURIComponent(item.title)}`;

  return (
    <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-dark-900 w-full max-w-2xl md:rounded-3xl rounded-t-[2.5rem] border border-dark-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-10 duration-500">
        
        {/* Cinematic Header Area */}
        <div className="relative h-72 w-full shrink-0 group">
            <img src={item.poster} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />
            
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
                <span className="px-3 py-1.5 bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                    {item.type}
                </span>
                <button 
                    onClick={onClose}
                    className="bg-black/50 hover:bg-black/80 p-2.5 rounded-full text-white backdrop-blur-xl transition-all hover:rotate-90"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="absolute bottom-6 left-8">
               <h2 className="text-4xl font-black text-white font-serif leading-tight drop-shadow-2xl">{item.title}</h2>
               <div className="flex items-center gap-4 mt-2 text-gray-300 font-bold text-xs">
                  <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500" fill="currentColor"/> {item.rating || '8.5'}</span>
                  <span className="flex items-center gap-1"><Calendar size={14}/> {item.year}</span>
                  <span className="flex items-center gap-1"><Clock size={14}/> {item.runtime || '2h 15m'}</span>
               </div>
            </div>
        </div>

        {/* Content Body */}
        <div className="p-8 relative flex-1 overflow-y-auto no-scrollbar bg-dark-900">
            <div className="grid md:grid-cols-[1.5fr_1fr] gap-8">
                
                {/* Left Column: Synopsis & Media */}
                <div className="space-y-8">
                    <section>
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                           <PlayCircle size={14}/> Synopsis
                        </h3>
                        <p className="text-gray-300 leading-relaxed text-sm font-medium">
                            {item.description}
                        </p>
                    </section>

                    <section>
                         <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                           <Clapperboard size={14}/> Trailer
                        </h3>
                        <div className="aspect-video w-full rounded-2xl bg-dark-800 border border-dark-700 flex flex-col items-center justify-center group cursor-pointer hover:border-brand-500/50 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-brand-500 transition-all group-hover:scale-110 shadow-xl">
                                <PlayCircle size={24} fill="currentColor" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 mt-3 group-hover:text-white transition-colors">WATCH PREVIEW</span>
                        </div>
                    </section>
                </div>

                {/* Right Column: Properties & Cast */}
                <div className="space-y-8">
                    <section className="bg-dark-800/50 p-5 rounded-2xl border border-dark-700">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Users size={14}/> Top Cast
                        </h3>
                        <div className="space-y-4">
                            {cast.map((member, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-dark-700 border border-dark-600 flex items-center justify-center text-[10px] font-black text-gray-400">
                                        {member.charAt(0)}
                                    </div>
                                    <span className="text-xs font-bold text-gray-200">{member}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Genres</h3>
                        <div className="flex flex-wrap gap-2">
                            {item.genre.map(g => (
                                <span key={g} className="px-2.5 py-1 bg-dark-800 text-gray-400 rounded-lg text-[10px] font-black border border-dark-700">
                                    {g}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Sticky/Fixed Bottom Actions */}
            <div className="mt-12 flex flex-col gap-3 sticky bottom-0 bg-dark-900 pt-4 pb-2">
                <a 
                    href={watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                >
                    <ExternalLink size={18} /> Watch Here on CineGemini
                </a>
                
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => onAction('watched')}
                        className="py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                        <Check size={16} strokeWidth={3} /> Completed
                    </button>
                    <button 
                        onClick={() => onAction('backlog')}
                        className="py-4 bg-dark-800 border border-dark-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-dark-700 transition-all flex items-center justify-center gap-2"
                    >
                        <BookOpen size={16} strokeWidth={3} /> Save for Later
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;