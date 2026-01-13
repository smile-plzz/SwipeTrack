import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { CollectionItem } from '../types';
import { parseDurationToHours, formatHours } from '../utils';
import { Clock, TrendingUp, History, Star, Cloud, Info, Database, AlertCircle } from 'lucide-react';

interface StatsViewProps {
  collection: CollectionItem[];
  onItemClick: (item: CollectionItem) => void;
}

const StatsView: React.FC<StatsViewProps> = ({ collection, onItemClick }) => {
  const watchedItems = collection.filter(i => i.status === 'watched');

  // Calculations
  let totalHours = 0;
  let gameHours = 0;
  let movieHours = 0;
  let seriesHours = 0;

  watchedItems.forEach(item => {
    const hours = parseDurationToHours(item.runtime);
    if (item.type === 'game') gameHours += hours;
    else if (item.type === 'movie') movieHours += hours;
    else if (item.type === 'series') seriesHours += hours;
    totalHours += hours;
  });

  const pieData = [
    { name: 'GAMES', value: gameHours, color: '#10b981', count: watchedItems.filter(i => i.type === 'game').length },
    { name: 'MOVIES', value: movieHours, color: '#6366f1', count: watchedItems.filter(i => i.type === 'movie').length },
    { name: 'SERIES', value: seriesHours, color: '#ec4899', count: watchedItems.filter(i => i.type === 'series').length },
  ].filter(d => d.value > 0 || d.count > 0);

  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-col gap-3 mt-8 max-w-[240px] mx-auto">
        {payload.map((entry: any, index: number) => {
          const percentage = totalHours > 0 ? ((entry.payload.value / totalHours) * 100).toFixed(0) : '0';
          return (
            <div key={`legend-${index}`} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: entry.color }} />
                <span className="text-[10px] font-black tracking-[0.15em] text-white/70 group-hover:text-white transition-colors">
                  {entry.value}
                </span>
              </div>
              <div className="flex items-center gap-3 text-right">
                <span className="text-[10px] font-black text-white">{entry.payload.count} items</span>
                <span className="text-[10px] text-gray-500 font-bold w-10">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-4 pb-24 overflow-y-auto h-full space-y-6 no-scrollbar bg-dark-900">
      {/* Enhanced Header with Status */}
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl font-black text-white font-serif tracking-tight">Analytics</h2>
        <div className="flex items-center gap-2 bg-dark-800/80 px-4 py-2 rounded-full border border-dark-700/50 shadow-sm">
           <Database size={12} className="text-brand-500" />
           <div className="flex flex-col">
              <span className="text-[8px] text-white uppercase font-black tracking-widest leading-none">RestDB Active</span>
              <span className="text-[7px] text-gray-500 font-bold mt-0.5">Cloud Sync Enabled</span>
           </div>
        </div>
      </div>

      {/* Network Error Warning (If detected) */}
      {collection.length === 0 && (
         <div className="mx-2 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3">
            <AlertCircle size={20} className="text-amber-500 shrink-0" />
            <p className="text-[10px] text-amber-200/80 font-medium leading-tight">
               If you see "Failed to Fetch", please ensure the collection <span className="text-white font-bold">'user-entries'</span> exists in your RestDB dashboard and CORS is enabled.
            </p>
         </div>
      )}

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-dark-800 to-dark-900 p-6 rounded-[2.5rem] border border-dark-700/50 shadow-xl relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-brand-500/10 rounded-full blur-2xl group-hover:bg-brand-500/20 transition-all" />
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Time Logged</p>
          <div className="text-3xl font-black text-white tracking-tighter">{formatHours(totalHours)}</div>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-brand-500 font-bold">
            <TrendingUp size={12} /> {watchedItems.length} Total
          </div>
        </div>
        <div className="bg-gradient-to-br from-dark-800 to-dark-900 p-6 rounded-[2.5rem] border border-dark-700/50 shadow-xl relative group">
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Quality Avg</p>
          <div className="text-3xl font-black text-yellow-500 tracking-tighter">
            {watchedItems.length > 0 
              ? (watchedItems.reduce((acc, i) => acc + (i.userRating || 0), 0) / (watchedItems.filter(i => i.userRating > 0).length || 1)).toFixed(1)
              : '0.0'}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-yellow-600 font-bold">
            <Star size={12} fill="currentColor" /> Out of 5.0
          </div>
        </div>
      </div>

      {/* Medium Split - Detailed View */}
      <div className="bg-dark-800/40 backdrop-blur-xl rounded-[3rem] p-10 border border-dark-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 blur-3xl rounded-full" />
        
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-[11px] font-black text-white/90 uppercase tracking-[0.3em]">Medium Split</h3>
          <div className="w-10 h-10 rounded-2xl bg-dark-700/30 flex items-center justify-center text-gray-500">
             <Info size={18} />
          </div>
        </div>
        
        <div className="h-80 w-full relative">
          {totalHours > 0 || watchedItems.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  innerRadius={85} 
                  outerRadius={115} 
                  paddingAngle={12} 
                  dataKey="value" 
                  stroke="none"
                  animationBegin={300}
                  animationDuration={1400}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        className="filter drop-shadow-[0_0_12px_rgba(0,0,0,0.3)] transition-all cursor-pointer hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px', padding: '14px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}
                   itemStyle={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', color: '#fff' }}
                />
                <Legend content={renderCustomLegend} verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-4">
               <div className="w-20 h-20 rounded-full border-2 border-dashed border-dark-700 flex items-center justify-center opacity-30">
                  <PieChartIcon size={32} />
               </div>
               <p className="text-[11px] font-black uppercase tracking-widest text-gray-500">Awaiting Log Data</p>
            </div>
          )}
          
          {/* Central Summary Hub */}
          {(totalHours > 0 || watchedItems.length > 0) && (
            <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none animate-in fade-in zoom-in duration-1000">
              <span className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] block mb-1">Total</span>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-black text-white tracking-tighter">
                  {Math.floor(totalHours)}
                </span>
                <span className="text-sm font-black text-brand-500 ml-1">H</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History Log Feed */}
      <div className="space-y-5 px-2">
        <div className="flex items-center justify-between border-b border-dark-700/50 pb-3">
          <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
            <History size={16} className="text-brand-500" /> Recent Entries
          </div>
          <div className="text-[10px] font-black text-white bg-dark-800 px-3 py-1 rounded-lg border border-dark-700/50">
            {collection.length} ITEMS
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {[...collection].sort((a, b) => b.dateAdded - a.dateAdded).slice(0, 5).map(item => (
            <div 
              key={item.id} 
              onClick={() => onItemClick(item)}
              className="flex items-center gap-5 p-4 bg-dark-800/30 hover:bg-dark-800/60 rounded-[2rem] border border-dark-700/20 transition-all group active:scale-[0.96] cursor-pointer"
            >
              <div className="w-16 h-16 shrink-0 rounded-2xl overflow-hidden bg-dark-900 border border-dark-700 shadow-2xl relative">
                <img src={item.poster} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt={item.title} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-black text-white/90 truncate group-hover:text-brand-400 transition-colors leading-tight">
                    {item.title}
                </div>
                <div className="flex items-center gap-3 mt-2">
                   <span className="text-[9px] font-black px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 uppercase tracking-widest border border-brand-500/10">
                      {item.type}
                   </span>
                   <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                      {new Date(item.dateAdded).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                   </span>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0">
                {item.userRating > 0 ? (
                  <div className="flex items-center gap-1 text-yellow-500 font-black text-sm bg-yellow-500/10 px-3 py-1.5 rounded-xl border border-yellow-500/10 shadow-lg">
                    <Star size={14} fill="currentColor" /> {item.userRating}
                  </div>
                ) : (
                  <div className="text-[10px] text-gray-600 uppercase font-black tracking-widest bg-dark-700/30 px-3 py-1.5 rounded-xl">PENDING</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PieChartIcon = ({ size }: { size: number }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
);

export default StatsView;