export type WallpaperProps = {
	id: number;
	name: string;
	hash: string;
	size: number;
	x: number;
	y: number;
	w: number;
	h: number;
	color: string;
	shadow: string;
};

export type WallpaperUpdateProps = {
	id: number;
	x: number;
	y: number;
	w: number;
	h: number;
	color: string;
	shadow: string;
}
