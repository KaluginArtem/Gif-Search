import type { GiphyGif } from "../types/giphy";
import type { JSX } from "react/jsx-dev-runtime";
import GifCard from "./GifCard";

type Props = {
    items: GiphyGif[];
};

export default function GifGrid({items}: Props): JSX.Element {
    return (
        <div style = {{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 14,
            marginTop: 18,
        }}>
            {items.map((gif) => (
                <GifCard key = {gif.id} gif = {gif}/>
            ))}
        </div>
    );
}