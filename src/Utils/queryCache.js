// Simple query cache with in-memory Map + localStorage persistence
const STORAGE_KEY = 'app_query_cache_v1';

class QueryCache {
  constructor() {
    this.store = new Map();
    this._loadFromStorage();
  }

  _loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      Object.keys(parsed).forEach((k) => {
        this.store.set(k, parsed[k]);
      });
    } catch (e) {
      console.warn('queryCache: failed to load from storage', e);
    }
  }

  _persist() {
    try {
      const obj = {};
      for (const [k, v] of this.store.entries()) obj[k] = v;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch (e) {
      console.warn('queryCache: failed to persist', e);
    }
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.ttl && Date.now() > entry.cachedAt + entry.ttl) {
      this.store.delete(key);
      this._persist();
      return null;
    }
    return entry.value;
  }

  set(key, value, opts = {}) {
    const entry = {
      value,
      cachedAt: Date.now(),
      ttl: opts.ttl || null,
    };
    this.store.set(key, entry);
    this._persist();
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear() {
    this.store.clear();
    try { localStorage.removeItem(STORAGE_KEY); } catch(e){}
  }

  // Update meta for any cached entry that includes an item with the given id.
  // This will scan cached lists/objects and attach _cache metadata to matching items.
  updateMetaById(id, meta = {}) {
    let changed = false;
    for (const [key, entry] of this.store.entries()) {
      const v = entry.value;
      if (!v) continue;
      if (Array.isArray(v.data)) {
        const arr = v.data;
        let updated = false;
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i];
          if (!item) continue;
          if (item.id === id || item._id === id) {
            item._cache = Object.assign({}, item._cache || {}, meta);
            updated = true;
          }
        }
        if (updated) {
          changed = true;
          this.store.set(key, entry);
        }
      } else if (v.data && (v.data.id === id || v.data._id === id)) {
        v.data._cache = Object.assign({}, v.data._cache || {}, meta);
        this.store.set(key, entry);
        changed = true;
      }
    }
    if (changed) this._persist();
  }

  // Find and return meta for an item by id (first match)
  getMetaById(id) {
    for (const [, entry] of this.store.entries()) {
      const v = entry.value;
      if (!v) continue;
      if (Array.isArray(v.data)) {
        for (const item of v.data) {
          if (!item) continue;
          if (item.id === id || item._id === id) return item._cache || null;
        }
      } else if (v.data && (v.data.id === id || v.data._id === id)) {
        return v.data._cache || null;
      }
    }
    return null;
  }
}

const queryCache = new QueryCache();
export default queryCache;
