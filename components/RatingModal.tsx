import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { TAGS } from '../constants';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (rating: number, tags: string[]) => void;
  title: string;
}

const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, onConfirm, title }) => {
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-dark-800 w-full max-w-sm rounded-3xl p-6 border border-dark-700 shadow-2xl transform scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-4">
           <h3 className="text-xl font-bold text-white leading-tight">Rate <br/><span className="text-brand-500">{title}</span></h3>
           <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110 focus:outline-none"
            >
              <Star 
                size={32} 
                fill={star <= rating ? "#eab308" : "transparent"} 
                className={star <= rating ? "text-yellow-500" : "text-gray-600"} 
                strokeWidth={star <= rating ? 0 : 2}
              />
            </button>
          ))}
        </div>

        <div className="mb-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Vibe Checks</p>
          <div className="flex flex-wrap gap-2">
            {TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  selectedTags.includes(tag)
                    ? 'bg-brand-600 border-brand-500 text-white'
                    : 'bg-dark-700 border-dark-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => onConfirm(rating, selectedTags)}
          disabled={rating === 0}
          className="w-full py-3 bg-white text-black font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
        >
          Save to Collection
        </button>
      </div>
    </div>
  );
};

export default RatingModal;