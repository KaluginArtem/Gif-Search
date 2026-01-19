import type { GiphyGif, GiphyListResponse } from "../types/giphy";

const API_KEY = import.meta.env.VITE_GIPHY_API_KEY;
const BASE = "https://api.giphy.com/v1/gifs";

function assertKey() {
    if(!API_KEY) throw new Error("GIPHY API key is not defined");
}

async function getJSON<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if(!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json() as Promise<T>;
}

export async function trendingGifs(params: { limit: number; offset: number }) {
    assertKey();
    const { limit, offset } = params;
    const url = `${BASE}/trending?api_key=${API_KEY}&limit=${limit}&offset=${offset}&rating=g`;
    return getJSON<GiphyListResponse>(url);
}

export async function searchGifs(params: { query: string; limit: number; offset: number }) {
    assertKey();
    const { query, limit, offset } = params;
    const url = `${BASE}/search?api_key=${API_KEY}&q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}&rating=g&lang=en`;
    return getJSON<GiphyListResponse>(url);
}

export async function getGifById(id: string) {
    assertKey();
    const url = `${BASE}/${id}?api_key=${API_KEY}`;
    const json = await getJSON<{ data: GiphyGif }>(url);
    return json.data;
}