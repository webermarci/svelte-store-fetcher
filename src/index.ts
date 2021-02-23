import { writable, Writable } from 'svelte/store'

interface CachedData {
    until: number;
    data: any;
}

export const get = (url: string, cacheMillisconds = 100): Writable<Promise<unknown>> => {
    const store = writable(new Promise(() => { }));

    const stored = localStorage.getItem(url);
    if (stored) {
        const cachedData: CachedData = JSON.parse(stored);
        store.set(Promise.resolve(cachedData.data));
        if (cachedData.until > new Date().getTime()) {
            return store;
        }
    }

    (async () => {
        const response = await fetch(url);
        const data = await response.json();
        store.set(Promise.resolve(data));
        const dataToCache: CachedData = {
            until: new Date().getTime() + cacheMillisconds,
            data: data
        }
        localStorage.setItem(url, JSON.stringify(dataToCache));
    })()

    return store;
}