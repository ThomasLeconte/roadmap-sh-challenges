type CacheItem = {
    data: any;
    expiry: number;
};

export default class AbstractApiClient {
    private cache: Map<string, CacheItem>;
    private readonly CACHE_EXPIRY = 1000 * 60 * 5; // 5 minutes

    constructor() {
        this.cache = new Map();
    }

    async get(url: string, options?: {authToken?: string, refreshCache?: boolean}) {
        if(options && !options.refreshCache) {
            const cachedData = this.cache.get(url);
            if(cachedData) {
                if(cachedData.expiry < Date.now()) {
                    this.cache.delete(url);
                } else {
                    return cachedData.data;
                }
            }
        }

        let headers: any = {
            'Content-Type': 'application/json'
        };
        if(options && options.authToken) {
            headers['Authorization'] = `Bearer ${options.authToken}`;
        }

        return fetch(url, {
            method: 'GET',
            headers
        }).then(res => {
            if(!res.ok) {
                throw new Error('Failed to fetch data');
            }
            return res.json();
        }).then(data => {
            this.cache.set(url, {data, expiry: Date.now() + this.CACHE_EXPIRY});
            return data;
        });
    }

    invalidateCache(url: string) {
        this.cache.delete(url);
    }
}