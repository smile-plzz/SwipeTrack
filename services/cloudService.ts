import { CollectionItem } from '../types';

/**
 * DATABASE INTEGRATION (RESTDB.IO)
 * Fix: Removed 'cache-control' which often triggers CORS preflight issues in browser environments.
 */
const RESTDB_URL = 'https://swipetrack-06c8.restdb.io/rest/user-entries';
const API_KEY = 'bccf628e3205e55b31c8167698c67d4ae12f5';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-apikey': API_KEY,
});

export const syncUserData = async (username: string, collection: CollectionItem[]): Promise<void> => {
  // 1. Immediate Local Backup (Offline-first)
  localStorage.setItem(`swipetrack_collection_${username}`, JSON.stringify(collection));

  if (!username || collection.length === 0) return;

  // 2. Cloud Sync Logic
  // Using a simplified sync strategy: push the most recent activity to the cloud.
  try {
    const latestItem = collection[0];
    
    // Check if the record already exists to avoid duplicates if possible, 
    // but for simplicity in this tracker we'll use a POST as an event log.
    const response = await fetch(RESTDB_URL, {
      method: 'POST',
      headers: getHeaders(),
      mode: 'cors', // Explicitly set cors mode
      body: JSON.stringify({
        username,
        itemId: latestItem.id,
        data: latestItem,
        syncedAt: new Date().toISOString()
      })
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn("RestDB Collection 'user-entries' not found. Please create it in your RestDB dashboard.");
      }
      throw new Error(`Cloud sync failed: ${response.statusText}`);
    }
  } catch (e) {
    // Graceful degradation: log but don't crash the UI
    console.error("RestDB Sync Error (Likely CORS or missing collection):", e);
  }
};

export const fetchUserData = async (username: string): Promise<CollectionItem[]> => {
  // Fallback to local storage immediately so UI is snappy
  const localSaved = localStorage.getItem(`swipetrack_collection_${username}`);
  const localItems = localSaved ? JSON.parse(localSaved) : [];

  try {
    const response = await fetch(`${RESTDB_URL}?q={"username":"${username}"}&max=50`, {
      method: 'GET',
      headers: getHeaders(),
      mode: 'cors'
    });

    if (!response.ok) throw new Error("Cloud fetch failed");

    const cloudRecords = await response.json();
    
    if (Array.isArray(cloudRecords) && cloudRecords.length > 0) {
      // Merge strategy: Use cloud data if it exists, but local is often more up-to-date
      const cloudItems = cloudRecords.map(record => record.data as CollectionItem);
      
      // Combine and deduplicate by ID
      const combined = [...localItems];
      cloudItems.forEach(cItem => {
        if (!combined.some(lItem => lItem.id === cItem.id)) {
          combined.push(cItem);
        }
      });
      
      return combined.sort((a, b) => b.dateAdded - a.dateAdded);
    }
  } catch (e) {
    console.warn("RestDB Fetch Error (Using local fallback):", e);
  }

  return localItems;
};