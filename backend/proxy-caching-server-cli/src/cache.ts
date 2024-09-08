export default class Cache {
    private cache: Map<string, any>;
    private static instance: Cache;
  
    private constructor() {
      this.cache = new Map<string, any>();
    }
  
    public static getInstance(): Cache {
      if (!Cache.instance) {
        Cache.instance = new Cache();
      }
  
      return Cache.instance;
    }
  
    public get(key: string): any {
      return this.cache.get(key);
    }
  
    public set(key: string, value: any): void {
      this.cache.set(key, value);
    }
  
    public clear(): void {
      this.cache.clear();
    }
}