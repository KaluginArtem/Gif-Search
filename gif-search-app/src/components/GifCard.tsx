import { useState } from "react";
import { Link } from "react-router-dom";
import type { GiphyGif } from "../types/giphy";
import GifQuickActions from "./GifQuickActions";
import type { JSX } from "react/jsx-dev-runtime";

type Props = {
  gif: GiphyGif;
};

function pickPreviewUrl(gif: GiphyGif): string {
  return (
    gif.images.fixed_width_downsampled?.url ||
    gif.images.fixed_width?.url ||
    gif.images.preview_gif?.url ||
    gif.images.original.url
  );
}

export default function GifCard({ gif }: Props): JSX.Element {
  const [open, setOpen] = useState(false);

  const url = pickPreviewUrl(gif);
  const title = gif.title?.trim() || "Untitled";

  return (
    <div
      style={{
        border: "1px solid #ffffffff",
        borderRadius: 14,
        overflow: "hidden",
        background: "#242424",
      }}
    >
      <Link
        to={`/gif/${gif.id}`}
        style={{ textDecoration: "none", color: "inherit", display: "block" }}
        title={title}
      >
        <div style={{ width: "100%", aspectRatio: "1 / 1", background: "#fafafa" }}>
          <img
            src={url}
            alt={title}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      </Link>

      <div style={{ padding: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ fontSize: 13, lineHeight: 1.3, flex: 1 }}>
          {title.length > 50 ? `${title.slice(0, 50)}…` : title}
        </div>

        <button
          aria-label="More"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          style={{
            border: "1px solid #ddd",
            background: "#242424",
            borderRadius: 10,
            padding: "6px 10px",
            cursor: "pointer",
            height: 32,
          }}
        >
          …
        </button>
      </div>

      {open && <GifQuickActions gif={gif} onClose={() => setOpen(false)} />}
    </div>
  );
}
