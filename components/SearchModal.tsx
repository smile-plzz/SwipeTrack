import React, { useState, useEffect } from 'react';
import { Search, X, Loader2, Plus, Film, Gamepad2, Tv } from 'lucide-react';
import { searchContent } from '../services/apiService';
import { MediaItem } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setQuery(debouncedQuery), 500);
    return () => clearTimeout(timer);
  }, [debouncedQuery]);

  useEffect(() => {
    if (query.length > 2) {
      setLoading(true);
      searchContent(query).then(data => {
        setResults(data);
        setLoading(false);
      });
    } else {
        setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-dark-900/95 backdrop-blur-sm flex flex-col animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="p-4 border-b border-dark-700 flex items-center gap-3">
        <Search className="text-gray-400" size={20} />
        <input 
          autoFocus
          type="text" 
          placeholder="Search movies, games, series..." 
          className="flex-1 bg-transparent text-white text-lg placeholder-gray-500 focus:outline-none"
          onChange={(e) => setDebouncedQuery(e.target.value)}
        />
        <button onClick={onClose} className="p-2 bg-dark-800 rounded-full text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        {loading && (
          <div className="flex justify-center mt-10">
            <Loader2 className="animate-spin text-brand-500" size={32} />
          </div>
        )}
        
        {!loading && results.length === 0 && query.length > 2 && (
             <div className="text-center text-gray-500 mt-10">
                 No results found.
             </div>
        )}

        <div className="space-y-3">
          {results.map(item => (
            <div 
                key={item.id} 
                onClick={() => onSelect(item)}
                className="flex gap-4 p-3 bg-dark-800 rounded-xl border border-dark-700 hover:border-brand-500 transition-colors cursor-pointer"
            >
               <img src={item.poster} alt={item.title} className="w-16 h-24 object-cover rounded-md bg-dark-900" />
               <div className="flex-1 flex flex-col justify-center">
                  <h4 className="font-bold text-white text-base leading-tight">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                          {item.type === 'movie' && <Film size={12}/>}
                          {item.type === 'series' && <Tv size={12}/>}
                          {item.type === 'game' && <Gamepad2 size={12}/>}
                          {item.type.toUpperCase()}
                      </span>
                      <span className="text-gray-600">•</span>
                      <span className="text-xs text-gray-400">{item.year || 'N/A'}</span>
                  </div>
               </div>
               <div className="flex items-center justify-center px-2">
                   <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-500">
                      <Plus size={18} />
                   </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;