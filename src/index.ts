import { writable, Writable } from 'svelte/store'

interface CachedData {
    until: number;
    data: any;
}

const getCached = (url: string) => {
    const cached = localStorage.getItem(url);
    if (cached) {
        return JSON.parse(cached) as CachedData;
    }
}

const setCached = (url: string, data: CachedData) => {
    localStorage.setItem(url, JSON.stringify(data));
}

export const get = (url: string, cacheMs = 100): Writable<Promise<unknown>> => {
    const store = writable(new Promise(() => { }));
    const now = new Date().getTime();

    const cached = getCached(url);
    if (cached) {
        store.set(Promise.resolve(cached.data));
        if (cached.until > now) {
            return store;
        }
    }

    (async () => {
        const response = await fetch(url);
        const data = await response.json();
        store.set(Promise.resolve(data));
        setCached(url, { until: now + cacheMs, data: data })
    })()

    return store;
}