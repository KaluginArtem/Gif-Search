import type { JSX } from "react/jsx-dev-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { GiphyGif } from "../types/giphy";
import { searchGifs, trendingGifs } from "../api/giphy";
import SearchBar from "../components/SearchBar";
import GifGrid from "../components/GifGrid";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

const LIMIT = 24;

// Ключ кеша в sessionStorage
function cacheKey(q: string) {
  return `home_cache_v1:q=${q.trim() || "__trending__"}`;
}

type HomeCache = {
  query: string;
  mode: "trending" | "search";
  items: GiphyGif[];
  offset: number;
  hasMore: boolean;
  scrollY: number;
};

export default function HomePage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQ = (searchParams.get("q") ?? "").trim();

  const [query, setQuery] = useState(urlQ);
  const [items, setItems] = useState<GiphyGif[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<"trending" | "search">(urlQ ? "search" : "trending");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const didRestoreRef = useRef(false);

  useEffect(() => {
    setQuery(urlQ);
    setMode(urlQ ? "search" : "trending");
  }, [urlQ]);

  const fetchPage = useCallback(async (q: string, pageOffset: number) => {
    const trimmed = q.trim();
    return trimmed
      ? searchGifs({ query: trimmed, limit: LIMIT, offset: pageOffset })
      : trendingGifs({ limit: LIMIT, offset: pageOffset });
  }, []);

  const saveCache = useCallback(
    (next: Partial<HomeCache>) => {
      const key = cacheKey(urlQ);
      const prevRaw = sessionStorage.getItem(key);
      const prev: HomeCache | null = prevRaw ? JSON.parse(prevRaw) : null;

      const merged: HomeCache = {
        query: urlQ,
        mode,
        items,
        offset,
        hasMore,
        scrollY: window.scrollY,
        ...(prev ?? {}),
        ...next,
      };

      sessionStorage.setItem(key, JSON.stringify(merged));
    },
    [urlQ, mode, items, offset, hasMore]
  );

  const restoreFromCache = useCallback(() => {
    const key = cacheKey(urlQ);
    const raw = sessionStorage.getItem(key);
    if (!raw) return false;

    try {
      const cached: HomeCache = JSON.parse(raw);
      setItems(cached.items ?? []);
      setOffset(cached.offset ?? 0);
      setHasMore(cached.hasMore ?? true);
      setMode(cached.mode ?? (urlQ ? "search" : "trending"));
      setError(null);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: cached.scrollY ?? 0, left: 0, behavior: "auto" });
        });
      });

      return true;
    } catch {
      return false;
    }
  }, [urlQ]);

  const loadFirstPage = useCallback(
    async (q: string) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchPage(q, 0);

        setItems(res.data);
        setOffset(0);
        setHasMore(res.pagination.count === LIMIT);

        const nextMode: "trending" | "search" = q.trim() ? "search" : "trending";
        setMode(nextMode);

        window.scrollTo({ top: 0, left: 0, behavior: "auto" });

        saveCache({
          query: q.trim(),
          mode: nextMode,
          items: res.data,
          offset: 0,
          hasMore: res.pagination.count === LIMIT,
          scrollY: 0,
        });
      } catch (e: any) {
        setError(e?.message ?? "Request failed");
        setItems([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [fetchPage, saveCache]
  );

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    const nextOffset = offset + LIMIT;
    setLoading(true);
    setError(null);

    try {
      const res = await fetchPage(query, nextOffset);

      setItems((prev) => {
        const merged = [...prev, ...res.data];
        saveCache({
          items: merged,
          offset: nextOffset,
          hasMore: res.pagination.count === LIMIT,
          scrollY: window.scrollY,
        });
        return merged;
      });

      setOffset(nextOffset);
      setHasMore(res.pagination.count === LIMIT);
    } catch (e: any) {
      setError(e?.message ?? "Request failed");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [fetchPage, query, offset, loading, hasMore, saveCache]);

  useEffect(() => {
    if (didRestoreRef.current) return;

    const restored = restoreFromCache();
    didRestoreRef.current = true;

    if (!restored) {
      loadFirstPage(urlQ);
    }
  }, [urlQ, loadFirstPage, restoreFromCache]);

  useEffect(() => {
    return () => {
      saveCache({ scrollY: window.scrollY });
    };
  }, [saveCache]);

  const sentinelRef = useInfiniteScroll(loadMore, !loading && hasMore && !error);

  const normalizedQuery = useMemo(() => query.trim(), [query]);

  return (
    <div style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ margin: "8px 0 16px", color: "#fff" }}>GIF Search</h1>

      <SearchBar
        value={query}
        onChange={setQuery}
        onSubmit={(q) => {
          const trimmed = q.trim();
          setSearchParams(trimmed ? { q: trimmed } : {}); 
          loadFirstPage(trimmed);
        }}
        loading={loading}
      />

      <div style={{ marginTop: 12, color: "#fff", opacity: 0.85 }}>
        {mode === "trending" ? (
          <span>Trending</span>
        ) : (
          <span>
            Results for: <b>{normalizedQuery}</b>
          </span>
        )}
      </div>

      {error && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #ffffff",
            background: "#242424",
            color: "#fff",
          }}
        >
          Error: {error}
        </div>
      )}

      {!error && !loading && items.length === 0 && (
        <div style={{ marginTop: 16, color: "#fff", opacity: 0.7 }}>No results.</div>
      )}

      {items.length > 0 && <GifGrid items={items} />}

      <div ref={sentinelRef} style={{ height: 1 }} />

      <div style={{ marginTop: 16, color: "#fff", opacity: 0.8, textAlign: "center" }}>
        {loading && items.length > 0 ? "Loading more…" : null}
        {!loading && !error && !hasMore && items.length > 0 ? "No more results" : null}
      </div>
    </div>
  );
}
