import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getGifById } from "../api/giphy";
import type { GiphyGif } from "../types/giphy";
import { dowloadByUrl } from "../utils/download";
import type { JSX } from "react/jsx-dev-runtime";

function pickBestUrl(gif: GiphyGif): string {
    return gif.images.original.url;
}

function safeName(s: string): string {
    const cleaned = (s || "gif")
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
    return cleaned || "gif";
}

export default function GifDetailsPage(): JSX.Element {
  const { id } = useParams();
  const [gif, setGif] = useState<GiphyGif | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const backTo = (location.state as any)?.from ?? "/";

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getGifById(id);
        if (!cancelled) setGif(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load GIF");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const url = useMemo(() => (gif ? pickBestUrl(gif) : ""), [gif]);

  const onCopy = async () => {
    if (!gif) return;
    await navigator.clipboard.writeText(url);
    alert("Copied!");
  };

  const onDownload = async () => {
    if (!gif) return;
    const filename = `${safeName(gif.title)}-${gif.id}.gif`;
    await dowloadByUrl(url, filename);
  };

  if (!id) {
    return (
      <div style={{ padding: 16 }}>
        <Link to="/">← Back</Link>
        <p>Missing id</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <Link to={backTo} style={{ textDecoration: "none" }}>
        ← Back
      </Link>

      <h1 style={{ margin: "12px 0" }}>GIF Details</h1>

      {loading && <div>Loading…</div>}

      {error && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #f3c5c5",
            background: "#fff5f5",
          }}
        >
          Error: {error}
        </div>
      )}

      {gif && (
        <div
          style={{
            marginTop: 12,
            border: "1px solid #eee",
            borderRadius: 16,
            overflow: "hidden",
            background: "#242424",
          }}
        >
          <div style={{ background: "#fafafa" }}>
            <img
              src={url}
              alt={gif.title || "gif"}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>

          <div style={{ padding: 14 }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>
              {gif.title?.trim() || "Untitled"}
            </div>

            <div style={{ marginTop: 8, opacity: 0.85, lineHeight: 1.5 }}>
              <div>
                <b>Author:</b> {gif.username?.trim() ? gif.username : "Unknown"}
              </div>
              <div>
                <b>Imported:</b>{" "}
                {gif.import_datetime && gif.import_datetime !== "1970-01-01 00:00:00"
                  ? gif.import_datetime
                  : "Unknown"}
              </div>
              <div>
                <b>Size:</b>{" "}
                {gif.images.original.width}×{gif.images.original.height} px
                {gif.images.original.size ? ` • ${gif.images.original.size} bytes` : ""}
              </div>
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={onCopy}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  background: "#242424",
                  cursor: "pointer",
                }}
              >
                Copy link
              </button>

              <button
                onClick={onDownload}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  background: "#242424",
                  cursor: "pointer",
                }}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}