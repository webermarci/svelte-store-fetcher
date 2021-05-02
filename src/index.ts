import { writable, Writable } from 'svelte/store'

interface CachedData {
    until: number;
    data: any;
}

const getCached = (key: string) => {
    const cached = localStorage.getItem(key);
    if (cached) {
        return JSON.parse(cached) as CachedData;
    }
}

const setCached = (key: string, data: CachedData) => {
    localStorage.setItem(key, JSON.stringify(data));
}

const generateKey = (requestInfo: RequestInfo) => {
    if (typeof requestInfo === "string") {
        return `ssf[${requestInfo}]`;
    }

    let headers: string[] = [];
    for (const [key, value] of requestInfo.headers) {
        headers.push(`${key}:${value}`);
    }
    return `ssf[${requestInfo.method} ${requestInfo.url} ${hashCode(`${headers}`)}]`;
}

const hashCode = (s: string) => {
    var hash = 0, i, chr;
    for (i = 0; i < s.length; i++) {
        chr = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash.toString(16);
}

export const get = (requestInfo: RequestInfo, cacheMs = 10): Writable<Promise<any>> => {
    const store = writable(new Promise(() => { }));
    const now = new Date().getTime();
    const key = generateKey(requestInfo);

    const cached = getCached(key);
    if (cached) {
        store.set(Promise.resolve(cached.data));
        if (cached.until > now) {
            return store;
        }
    }

    (async () => {
        try {
            const response = await fetch(requestInfo);
            const data = await response.json();
            store.set(Promise.resolve(data));
            setCached(key, { until: now + cacheMs, data: data });
        } catch (err) {
            return Promise.reject(err);
        }
    })()

    return store;
}

export const clearExpired = () => {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith("ssf[") || !key.endsWith("]")) {
            continue;
        }

        const cached = getCached(key);
        if (cached && cached.until > new Date().getTime()) {
            localStorage.removeItem(key);
        }
    }
}

export const clearAll = () => {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("ssf[") && key?.endsWith("]")) {
            localStorage.removeItem(key);
        }
    }
}