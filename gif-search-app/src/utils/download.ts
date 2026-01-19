export async function dowloadByUrl(url: string, filname: string) {
    const res = await fetch(url);
    if(!res.ok) throw new Error(`Download failed HHTP ${res.status}`);

    const blob = await res.blob();
    const objUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = objUrl;
    a.download = filname;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(objUrl);
}