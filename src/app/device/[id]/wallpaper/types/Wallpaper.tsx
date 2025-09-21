export type WallpaperProps = {
	id: number;
	name: string;
	hash: string;
	fileName: string;
	size: number;
	labelXPer: number;
	labelYPer: number;
	labelWPer: number;
	labelHPer: number;
	color: string;
	shadow: string;
};

export type WallpaperUpdateProps = {
	id: number;
	labelXPer: number;
	labelYPer: number;
	labelWPer: number;
	labelHPer: number;
	color: string;
	shadow: string;
}
