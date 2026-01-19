import { useEffect, useState } from "react";
import type { JSX } from "react/jsx-dev-runtime";

type Props = {
    value: string;
    onChange:(v: string) => void;
    onSubmit:(q: string) => void;
    loading?: boolean;
};

export default function SearchBar({value, onChange, onSubmit, loading}: Props): JSX.Element {
    const [local, setLocal] = useState(value);
    useEffect(() => setLocal(value), [value]);

    const submit = () => {
        const q = local;
        onChange(q);
        onSubmit(q);
    }

    const clear = () => {
        setLocal("");
        onChange("");
        onSubmit("");
    }
    return (
        <div style = {{display: "flex", gap: 8, alignItems: "center"}}>
            <input 
                value = {local} placeholder = "Search GIFs... (empty = Trending)"
                onChange = {(e) => setLocal(e.target.value)}
                onKeyDown = {(e) => {
                    if(e.key === "Enter") submit();
                    if(e.key === "Escape") clear();
                }}
                style = {{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    outline: "none",
                    background: "#242424",
                    color: "#ffffff"
                }}
            />
            <button
                onClick={submit} disabled={!!loading}
                style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    background: "#242424",
                    color: "#ffffff",
                    cursor: loading ? "not-allowed" : "pointer",
                }}
            >
                {loading ? "Loading..." : "Search"}
            </button>

            <button
                onClick={clear}
                disabled={!!loading}
                style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    background: "#242424",
                    color: "#ffffff",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: 0.9,
                }}
            >
                Clear
            </button>
        </div>
    );
}