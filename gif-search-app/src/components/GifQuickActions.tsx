import type { GiphyGif } from "../types/giphy";
import { dowloadByUrl } from "../utils/download";
import type { JSX } from "react/jsx-dev-runtime";

type Props = {
  gif: GiphyGif;
  onClose: () => void;
};

function pickShareUrl(gif: GiphyGif): string {
  return gif.images.original.url;
}

export default function GifQuickActions({ gif, onClose }: Props): JSX.Element {
  const shareUrl = pickShareUrl(gif);

  const copy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    alert("Copied!");
  };

  const download = async () => {
    const filename = `${(gif.title || "gif").slice(0, 30)}-${gif.id}.gif`;
    await dowloadByUrl(shareUrl, filename);
  };

  const author = gif.username?.trim() ? gif.username : "Unknown";
  const imported =
    gif.import_datetime && gif.import_datetime !== "1970-01-01 00:00:00"
      ? gif.import_datetime
      : "Unknown";

  return (
    <div
      style={{
        borderTop: "1px solid #eee",
        padding: 10,
        background: "#242424",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <div style={{ fontSize: 12, opacity: 0.85, lineHeight: 1.4 }}>
          <div>
            <b>Size:</b> {gif.images.original.width}×{gif.images.original.height}px
          </div>
          <div>
            <b>Author:</b> {author}
          </div>
          <div>
            <b>Date:</b> {imported}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={copy}
          style={{
            border: "1px solid #ffffffff",
            background: "#242424",
            borderRadius: 10,
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          Copy link
        </button>

        <button
          onClick={download}
          style={{
            border: "1px solid #fcfcfcff",
            background: "#242424",
            borderRadius: 10,
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          Download
        </button>
      </div>
    </div>
  );
}
