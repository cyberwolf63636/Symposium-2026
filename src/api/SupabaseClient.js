import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Custom "In-Memory" Storage
// This creates a variable that ONLY exists in the running code.
// It is NOT saved to the browser's hard drive or LocalStorage.
const memoryStorage = {
  store: new Map(),
  getItem: (key) => {
    return memoryStorage.store.get(key);
  },
  setItem: (key, value) => {
    memoryStorage.store.set(key, value);
  },
  removeItem: (key) => {
    memoryStorage.store.delete(key);
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // 🔒 SECURITY UPGRADE:
    // We tell Supabase: "Do NOT use localStorage. Use our memory variable."
    storage: memoryStorage, 
    autoRefreshToken: true,
    persistSession: true, // This keeps the session in memory
    detectSessionInUrl: true
  }
});
