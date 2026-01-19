export type GiphyImage = {
    url: string;
    width: string;
    height: string;
    size?: string;
};

export type GiphyGif = {
    id: string;
    title: string;
    username: string;
    import_datetime: string;
    images: {
        preview_gif?: GiphyImage;
        fixed_width?: GiphyImage;
        fixed_width_downsampled?: GiphyImage;
        original: GiphyImage;
    };
};

export type GiphyListResponse = {
    data: GiphyGif[];
    pagination: {
        total_count: number;
        count: number;
        offset: number;
    };
};