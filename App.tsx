import React, { useState, useEffect, useCallback } from 'react';
import { CollectionItem, MediaItem, SwipeDirection, MediaType } from './types';
import SwipeDeck from './components/SwipeDeck';
import Collection from './components/Collection';
import StatsView from './components/StatsView';
import RatingModal from './components/RatingModal';
import SearchModal from './components/SearchModal';
import DetailsModal from './components/DetailsModal';
import Login from './components/Login';
import { Layers, Grid, PieChart as PieChartIcon, Plus, LogOut, User, Cloud, CheckCircle2 } from 'lucide-react';
import { fetchGames, fetchMoviesAndSeries } from './services/apiService';
import { fetchUserData, syncUserData } from './services/cloudService';

enum View {
  DISCOVER = 'discover',
  COLLECTION = 'collection',
  STATS = 'stats'
}

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.DISCOVER);
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [deckItems, setDeckItems] = useState<MediaItem[]>([]);
  const [loadingDeck, setLoadingDeck] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [activeDeck, setActiveDeck] = useState<'all' | MediaType>('all');
  const [page, setPage] = useState(1);

  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  
  const [pendingItem, setPendingItem] = useState<MediaItem | null>(null);

  // Auth & Cloud Sync
  useEffect(() => {
    const savedUser = localStorage.getItem('swipetrack_user');
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      setIsSyncing(true);
      fetchUserData(user).then(data => {
          setCollection(data);
          setIsSyncing(false);
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setIsSyncing(true);
      syncUserData(user, collection).then(() => {
          setTimeout(() => setIsSyncing(false), 500);
      });
    }
  }, [collection, user]);

  const handleLogin = (username: string) => {
    setUser(username);
    localStorage.setItem('swipetrack_user', username);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('swipetrack_user');
    setCollection([]);
    setCurrentView(View.DISCOVER);
  };

  const loadDeckData = useCallback(async (reset = false) => {
    if (loadingDeck) return;
    setLoadingDeck(true);
    
    let newItems: MediaItem[] = [];
    const targetPage = reset ? 1 : page;

    try {
        if (activeDeck === 'game') {
            newItems = await fetchGames(targetPage);
        } else if (activeDeck === 'movie') {
            newItems = await fetchMoviesAndSeries('movie', targetPage);
        } else if (activeDeck === 'series') {
            newItems = await fetchMoviesAndSeries('series', targetPage);
        } else {
            const [movies, games] = await Promise.all([
                fetchMoviesAndSeries('movie', targetPage),
                fetchGames(targetPage)
            ]);
            newItems = [...movies, ...games].sort(() => Math.random() - 0.5);
        }

        const filteredNew = newItems.filter(
            ni => !collection.some(ci => ci.id === ni.id) && !deckItems.some(di => di.id === ni.id)
        );

        setDeckItems(prev => reset ? filteredNew : [...prev, ...filteredNew]);
        if (!reset) setPage(p => p + 1);
        else setPage(2);
        
    } catch (e) {
        console.error("Failed to load deck", e);
    } finally {
        setLoadingDeck(false);
    }
  }, [activeDeck, page, collection, deckItems, loadingDeck]);

  useEffect(() => {
    if (user) {
      setDeckItems([]);
      setPage(1);
      loadDeckData(true);
    }
  }, [activeDeck, user]);

  const addToCollection = (item: MediaItem, details: { status: 'watched' | 'backlog' | 'playing' | 'dropped', priority: boolean, userRating: number, tags: string[] }) => {
     const newItem: CollectionItem = {
      ...item,
      userRating: details.userRating,
      dateAdded: Date.now(),
      status: details.status,
      priority: details.priority,
      tags: details.tags
    };

    setCollection(prev => {
        if (prev.find(i => i.id === newItem.id)) return prev;
        return [newItem, ...prev];
    });
  };

  const handleSwipe = (item: MediaItem, direction: SwipeDirection) => {
    setDeckItems(prev => prev.filter(i => i.id !== item.id));

    if (direction === 'left') return; 

    if (direction === 'down') {
        addToCollection(item, { status: 'backlog', priority: false, userRating: 0, tags: [] });
    } else if (direction === 'up') {
        addToCollection(item, { status: 'backlog', priority: true, userRating: 0, tags: [] });
    } else if (direction === 'right') {
        addToCollection(item, { status: 'watched', priority: false, userRating: 0, tags: [] });
    }

    if (deckItems.length < 5) {
        loadDeckData();
    }
  };

  const handleRateConfirm = (rating: number, tags: string[]) => {
      if (pendingItem) {
          const existingIndex = collection.findIndex(i => i.id === pendingItem.id);
          if (existingIndex >= 0) {
              const updatedCollection = [...collection];
              updatedCollection[existingIndex] = {
                  ...updatedCollection[existingIndex],
                  userRating: rating,
                  tags: tags,
                  status: 'watched'
              };
              setCollection(updatedCollection);
          } else {
              addToCollection(pendingItem, { status: 'watched', priority: false, userRating: rating, tags });
          }
          setRatingModalOpen(false);
          setPendingItem(null);
      }
  };

  const handleItemClick = (item: MediaItem | CollectionItem) => {
      setPendingItem(item);
      setDetailsModalOpen(true);
  };

  const handleDetailsAction = (action: 'watched' | 'backlog' | 'rate') => {
      if (!pendingItem) return;

      if (action === 'rate') {
          setDetailsModalOpen(false);
          setRatingModalOpen(true);
      } else {
          addToCollection(pendingItem, { 
            status: action as any, 
            priority: false, 
            userRating: 0, 
            tags: [] 
          });
          setDetailsModalOpen(false);
          setPendingItem(null);
          setDeckItems(prev => prev.filter(i => i.id !== pendingItem.id));
      }
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="bg-dark-900 h-screen w-full flex flex-col text-white font-sans overflow-hidden">
      
      {/* Top Bar (Workspace Header) */}
      <div className="pt-6 px-6 pb-2 z-[100] bg-dark-900/90 backdrop-blur-2xl sticky top-0 border-b border-dark-700/50">
         <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setCurrentView(View.STATS)}>
                <div className="w-11 h-11 rounded-[1.2rem] bg-brand-500/10 flex items-center justify-center text-brand-500 border border-brand-500/20 group-hover:bg-brand-500 group-hover:text-white transition-all shadow-lg group-hover:shadow-brand-500/20">
                    <User size={22} />
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Connected</span>
                        {isSyncing ? (
                            <Cloud size={10} className="text-brand-500 animate-pulse" />
                        ) : (
                            <CheckCircle2 size={10} className="text-green-500" />
                        )}
                    </div>
                    <span className="text-sm font-black text-white leading-none tracking-tight">{user}</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                  onClick={() => setSearchModalOpen(true)}
                  className="w-11 h-11 rounded-[1.2rem] bg-dark-800/80 border border-dark-700/50 flex items-center justify-center text-gray-400 hover:bg-brand-500 hover:text-white transition-all hover:scale-110 active:scale-90"
              >
                 <Plus size={20} />
              </button>
              <button 
                  onClick={handleLogout}
                  className="w-11 h-11 rounded-[1.2rem] bg-dark-800/80 border border-dark-700/50 flex items-center justify-center text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all hover:scale-110 active:scale-90"
              >
                 <LogOut size={18} />
              </button>
            </div>
         </div>

         {/* Context-Aware Sub-navigation */}
         <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {currentView === View.DISCOVER ? (
              ['all', 'movie', 'series', 'game'].map(type => (
                  <button
                      key={type}
                      onClick={() => setActiveDeck(type as any)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all capitalize border uppercase tracking-widest ${
                          activeDeck === type 
                          ? 'bg-white text-black border-white shadow-[0_5px_15px_rgba(255,255,255,0.2)] scale-105' 
                          : 'text-gray-500 border-transparent hover:bg-white/5'
                      }`}
                  >
                      {type === 'all' ? 'Featured' : type}
                  </button>
              ))
            ) : (
                <div className="h-8 flex items-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
                        {currentView === View.COLLECTION ? 'Your Database' : 'Personal Insights'}
                    </span>
                </div> 
            )}
         </div>
      </div>

      {/* Main Viewport */}
      <main className="flex-1 relative overflow-hidden bg-dark-900">
        {currentView === View.DISCOVER && (
           <SwipeDeck 
              key={activeDeck}
              items={deckItems} 
              onSwipe={handleSwipe} 
              onCardClick={handleItemClick}
              onRefresh={() => loadDeckData(true)}
              isLoading={loadingDeck && deckItems.length === 0}
           />
        )}
        {currentView === View.COLLECTION && (
           <Collection 
              collection={collection} 
              onRateClick={(item) => { setPendingItem(item); setRatingModalOpen(true); }} 
              onItemClick={handleItemClick} 
           />
        )}
        {currentView === View.STATS && (
           <StatsView 
              collection={collection} 
              onItemClick={handleItemClick} 
           />
        )}
      </main>

      {/* Modern Dock-style Navigation */}
      <nav className="h-20 bg-dark-900/95 border-t border-dark-800/50 flex justify-around items-center px-8 z-[100] relative backdrop-blur-2xl">
         <button 
           onClick={() => setCurrentView(View.DISCOVER)}
           className={`flex flex-col items-center gap-2 transition-all group ${currentView === View.DISCOVER ? 'text-brand-500' : 'text-gray-600 hover:text-gray-400'}`}
         >
            <div className={`p-2 rounded-xl transition-all ${currentView === View.DISCOVER ? 'bg-brand-500/10' : ''}`}>
                <Layers size={22} strokeWidth={currentView === View.DISCOVER ? 2.5 : 2} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Discover</span>
         </button>

         <button 
           onClick={() => setCurrentView(View.COLLECTION)}
           className={`flex flex-col items-center gap-2 transition-all group ${currentView === View.COLLECTION ? 'text-brand-500' : 'text-gray-600 hover:text-gray-400'}`}
         >
            <div className={`p-2 rounded-xl transition-all ${currentView === View.COLLECTION ? 'bg-brand-500/10' : ''}`}>
                <Grid size={22} strokeWidth={currentView === View.COLLECTION ? 2.5 : 2} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Journal</span>
         </button>

         <button 
           onClick={() => setCurrentView(View.STATS)}
           className={`flex flex-col items-center gap-2 transition-all group ${currentView === View.STATS ? 'text-brand-500' : 'text-gray-600 hover:text-gray-400'}`}
         >
            <div className={`p-2 rounded-xl transition-all ${currentView === View.STATS ? 'bg-brand-500/10' : ''}`}>
                <PieChartIcon size={22} strokeWidth={currentView === View.STATS ? 2.5 : 2} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Stats</span>
         </button>
      </nav>

      {/* Global Modals */}
      <RatingModal 
         isOpen={ratingModalOpen}
         title={pendingItem?.title || ''}
         onClose={() => { setRatingModalOpen(false); setPendingItem(null); }}
         onConfirm={handleRateConfirm}
      />
      
      <SearchModal 
         isOpen={searchModalOpen}
         onClose={() => setSearchModalOpen(false)}
         onSelect={(item) => { setSearchModalOpen(false); handleItemClick(item); }}
      />

      <DetailsModal 
         isOpen={detailsModalOpen}
         item={pendingItem}
         onClose={() => { setDetailsModalOpen(false); setPendingItem(null); }}
         onAction={handleDetailsAction}
      />
    </div>
  );
};

export default App;