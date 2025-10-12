"use client";

import { useCallback, useEffect, useRef, useState, TouchList } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

import { fetchWallpaperUpload } from "../lib/api";

import { shortenFileName } from "@/lib/utils";
import { Result } from "@/lib/result";

export default function UploadDiv({
	deviceId,
	deviceWidth,
	deviceHeight,
	setIsFetchWallpaperList,

}:{
	deviceId: number;
	deviceWidth: number;
	deviceHeight: number;
	setIsFetchWallpaperList: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const imgRef = useRef<HTMLImageElement | null>(null);

	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [fileDispName, setFileDispName] = useState("No file chosen");
	const [previewURL, setPreviewURL] = useState<string | null>(null);
	const [uploadStatus, setUploadStatus] = useState<string | null>(null);

	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const [scale, setScale] = useState(1);

	const lastTouchDistanceRef = useRef<number | null>(null);
	const lastTouchCenterRef = useRef<{ x: number; y: number } | null>(null);

	const MAX_FILE_SIZE_MB = 16;

	/* ----------------- Utilities ----------------- */
	const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
	const easeInOutQuad = (t: number) =>
		t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

	const animateTo = (
		targetOffset: { x: number; y: number },
		targetScale?: number,
		duration = 300
	) => {
		const start = performance.now();
		const initialOffset = { ...offset };
		const initialScale = scale;

		const step = (time: number) => {
			const tRaw = Math.min((time - start) / duration, 1);
			const t = easeInOutQuad(tRaw);

			setOffset({
				x: lerp(initialOffset.x, targetOffset.x, t),
				y: lerp(initialOffset.y, targetOffset.y, t),
			});
			if (targetScale !== undefined) {
				setScale(lerp(initialScale, targetScale, t));
			}

			if (tRaw < 1) requestAnimationFrame(step);
		};

		requestAnimationFrame(step);
	};

	const loadImage = (url: string): Promise<HTMLImageElement> =>
		new Promise((resolve, reject) => {
			const img = new Image();
			img.src = url;
			img.onload = () => resolve(img);
			img.onerror = reject;
		});

	const resizeCanvas = (): Promise<void> =>
		new Promise((resolve) => {
			if (!canvasRef.current) return resolve();
			const canvas = canvasRef.current;
			const parent = canvas.parentElement;
			if (!parent) return resolve();

			const { width, height } = parent.getBoundingClientRect();
			const dpr = window.devicePixelRatio || 1;

			canvas.width = width * dpr;
			canvas.height = height * dpr;
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;
			resolve();
		});

	/* ----------------- Drawing ----------------- */
	const drawImage = useCallback(() => {
		if (!canvasRef.current || !imgRef.current) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		const img = imgRef.current;
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;
		const logicalWidth = canvas.width / dpr;
		const logicalHeight = canvas.height / dpr;

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

		// Background blurred fill
		const fillScale = Math.max(
			logicalWidth / img.width,
			logicalHeight / img.height
		);
		ctx.filter = "blur(4px) brightness(0.7)";
		ctx.drawImage(
			img,
			(logicalWidth - img.width * fillScale) / 2,
			(logicalHeight - img.height * fillScale) / 2,
			img.width * fillScale,
			img.height * fillScale
		);
		ctx.filter = "none";

		// Foreground image
		ctx.drawImage(
			img,
			offset.x,
			offset.y,
			img.width * scale,
			img.height * scale
		);
	}, [offset, scale]);

	/* ----------------- Mouse & Touch ----------------- */
	const startDragging = (e: React.MouseEvent<HTMLCanvasElement>) => {
		setIsDragging(true);
		setDragStart({ x: e.clientX, y: e.clientY });
	};
	const onDrag = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (!isDragging) return;
		const dx = e.clientX - dragStart.x;
		const dy = e.clientY - dragStart.y;
		setDragStart({ x: e.clientX, y: e.clientY });
		setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
	};
	const stopDragging = () => setIsDragging(false);

	const handleZoom = (e: React.WheelEvent<HTMLCanvasElement>) => {
		//e.preventDefault();
		const delta = e.deltaY < 0 ? 0.05 : -0.05;
		setScale((s) => Math.min(Math.max(s + delta, 0.1), 5));
	};

	const getTouchDistance = (touches: TouchList) => {
		if (touches.length < 2) return 0;
		const dx = touches[0].clientX - touches[1].clientX;
		const dy = touches[0].clientY - touches[1].clientY;
		return Math.sqrt(dx * dx + dy * dy);
	};
	const getTouchCenter = (touches: TouchList) => ({
		x: (touches[0].clientX + touches[1].clientX) / 2,
		y: (touches[0].clientY + touches[1].clientY) / 2,
	});

	const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
		if (e.touches.length === 1) {
			setIsDragging(true);
			setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
		} else if (e.touches.length === 2) {
			lastTouchDistanceRef.current = getTouchDistance(e.touches);
			lastTouchCenterRef.current = getTouchCenter(e.touches);
		}
	};

	const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
		e.preventDefault();
		if (e.touches.length === 1 && isDragging) {
			const dx = e.touches[0].clientX - dragStart.x;
			const dy = e.touches[0].clientY - dragStart.y;
			setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
			setOffset((p) => ({ x: p.x + dx, y: p.y + dy }));
		} else if (e.touches.length === 2) {
			const newDist = getTouchDistance(e.touches);
			const oldDist = lastTouchDistanceRef.current;
			if (oldDist && newDist) {
				setScale((s) =>
					Math.min(Math.max((s * newDist) / oldDist, 0.1), 5)
				);
				lastTouchDistanceRef.current = newDist;
			}
			const newCenter = getTouchCenter(e.touches);
			const oldCenter = lastTouchCenterRef.current;
			if (oldCenter) {
				setOffset((p) => ({
					x: p.x + newCenter.x - oldCenter.x,
					y: p.y + newCenter.y - oldCenter.y,
				}));
				lastTouchCenterRef.current = newCenter;
			}
		}
	};
	const handleTouchEnd = () => {
		setIsDragging(false);
		lastTouchDistanceRef.current = null;
		lastTouchCenterRef.current = null;
	};

	/* ----------------- File Handling ----------------- */
	const resetFile = () => {
		setSelectedFile(null);
		setFileDispName("No file chosen");
		setPreviewURL(null);
	};
	const handleFile = (file: File) => {
		const validTypes = ["image/png", "image/jpeg"];
		if (!validTypes.includes(file.type)) {
			setUploadStatus("❌ Only PNG, JPG, or JPEG files are allowed.");
			resetFile();
			return;
		}
		if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
			setUploadStatus(`❌ File size must be ≤ ${MAX_FILE_SIZE_MB}MB.`);
			resetFile();
			return;
		}
		setSelectedFile(file);
		setFileDispName(shortenFileName(file.name));
		setPreviewURL(URL.createObjectURL(file));
		setUploadStatus("");
	};
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const file = e.target.files?.[0];
		if (file) handleFile(file);
	};
	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const file = e.dataTransfer.files?.[0];
		if (file) handleFile(file);
	};
	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
		e.preventDefault();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		const img: HTMLImageElement | null = imgRef.current;
		const canvas: HTMLCanvasElement | null = canvasRef.current;
		
		if (!canvas || !img || !selectedFile) return;
		
		// scale represents the image width as a percent of the canvas width (fixed size)
		const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
		const canvasHeight = canvas.height / (window.devicePixelRatio || 1);
		const formData = new FormData();
		formData.append("file", selectedFile);
		formData.append("imgScalePer", JSON.stringify((img.width * scale) / canvasWidth));
		formData.append("xPosPer", JSON.stringify(offset.x / canvasWidth));
		formData.append("yPosPer", JSON.stringify(offset.y / canvasHeight));
		
		const result: Result<void> = await fetchWallpaperUpload(deviceId, formData);
		if (!result.success) {
			const errMsg: string = result.error;
			setUploadStatus(`❌ Upload failed: ${errMsg}`);
		} else {
			resetFile();
			setUploadStatus("✅ Wallpaper uploaded successfully!");
			setIsFetchWallpaperList(true);
		}
	};

	/* ----------------- Effects ----------------- */
	useEffect(() => {
		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);
		return () => window.removeEventListener("resize", resizeCanvas);
	}, []);

	useEffect(() => {
		if (previewURL) {
			let cancelled = false;
			Promise.all([loadImage(previewURL), resizeCanvas()])
				.then(([img]) => {
					if (cancelled) return;
					imgRef.current = img;
					const canvas = canvasRef.current;
					if (!canvas) return;
					const w = canvas.width / (window.devicePixelRatio || 1);
					const h = canvas.height / (window.devicePixelRatio || 1);
					const targetScale = Math.min(w / img.width, h / img.height);
					setScale(targetScale);
					setOffset({
						x: (w - img.width * targetScale) / 2,
						y: (h - img.height * targetScale) / 2,
					});
				})
				.catch(console.error);
			return () => {
				cancelled = true;
				imgRef.current = null;
			};
		}
	}, [previewURL]);

	useEffect(() => {
		drawImage();
	}, [offset, scale, drawImage]);

	useEffect(() => {
		if (uploadStatus) {
			const timer = setTimeout(() => setUploadStatus(null), 10000);
			return () => clearTimeout(timer);
		}
	}, [uploadStatus]);

	useEffect(
		() => () => {
			if (previewURL) URL.revokeObjectURL(previewURL);
		},
		[previewURL]
	);

	return (
		<div className="w-full max-w-4xl p-4 sm:p-6 mx-auto bg-stone-800 rounded-2xl flex flex-col justify-center">
			<h2 className="text-xl sm:text-xl text-white mb-2 self-start uppercase tracking-widest font-extrabold">
				Upload Wallpaper
			</h2>
			<div className="w-full h-px bg-white opacity-30 mb-6" />

			<form
				onSubmit={handleSubmit}
				className="w-full flex flex-col gap-4"
			>
				{uploadStatus && (
					<div className="w-full flex items-center justify-between text-white bg-stone-600 px-4 py-2 rounded-lg shadow-md">
						<p className="mr-4">{uploadStatus}</p>
						<button
							onClick={() => setUploadStatus(null)}
							className="text-white hover:text-red-400 transition duration-200 text-lg leading-none"
							aria-label="Close"
						>
							&times;
						</button>
					</div>
				)}

				{/* Drag and drop zone */}
				<div
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onClick={() => inputRef.current?.click()}
					className="w-full border-2 border-dashed border-white rounded-xl p-6 text-white text-center cursor-pointer hover:bg-stone-700 transition"
				>
					<p className="text-white">
						Drag & drop image here, or click to select
					</p>
					<p className="text-sm mt-2 text-stone-300">
						{fileDispName}
					</p>
				</div>

				<input
					type="file"
					accept=".png, .jpg, .jpeg"
					ref={inputRef}
					onChange={handleFileChange}
					className="hidden"
				/>

				{/* Image Preview */}
				{previewURL && (
					<div className="relative w-full flex justify-center">
						<Tooltip.Provider>
							<Tooltip.Root>
								<Tooltip.Trigger asChild>
									<button
										type="button"
										onClick={resetFile}
										className="absolute top-2 right-2 z-10 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full p-1"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={2}
											stroke="currentColor"
											className="w-5 h-5 text-white hover:text-red-400 transition-colors duration-200"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								</Tooltip.Trigger>
								<Tooltip.Portal>
									<Tooltip.Content
										side="top"
										align="end"
										className="bg-black text-white text-sm rounded px-2 py-1 shadow-lg animate-fade-in"
										sideOffset={6}
									>
										Remove image
										<Tooltip.Arrow className="fill-black w-4 h-2" />
									</Tooltip.Content>
								</Tooltip.Portal>
							</Tooltip.Root>
						</Tooltip.Provider>

						<div
							className="relative w-full"
							style={{ aspectRatio: `${deviceWidth} / ${deviceHeight}` }}
						>
							<canvas
								ref={canvasRef}
								//width={800}
								//height={480}
								className="w-full h-full border rounded-lg bg-black touch-none"
								style={{
									cursor: isDragging ? "grabbing" : "grab",
								}}
								onMouseDown={startDragging}
								onMouseMove={onDrag}
								onMouseUp={stopDragging}
								onMouseLeave={stopDragging}
								onWheel={handleZoom}
								onTouchStart={handleTouchStart}
								onTouchMove={handleTouchMove}
								onTouchEnd={handleTouchEnd}
							/>
						</div>
					</div>
				)}

				{/* Center Image Button */}
				{previewURL && (
					<div className="">
						<div className="flex justify-center gap-2">
							<button
								type="button"
								onClick={() =>
									animateTo({
										x: offset.x,
										y:
											(canvasRef.current!.height /
												(window.devicePixelRatio || 1) -
												imgRef.current!.height *
													scale) /
											2,
									})
								}
								className="w-full px-2 py-2 mb-4 bg-stone-600 text-white rounded-xl shadow-lg flex items-center justify-center text-xs sm:text-lg font-semibold transition-all duration-200 ease-in-out hover:bg-stone-700"
							>
								Center Vertically
							</button>
							<button
								type="button"
								onClick={() =>
									animateTo({
										x:
											(canvasRef.current!.width /
												(window.devicePixelRatio || 1) -
												imgRef.current!.width * scale) /
											2,
										y: offset.y,
									})
								}
								className="w-full px-2 py-2 mb-4 bg-stone-600 text-white rounded-xl shadow-lg flex items-center justify-center text-xs sm:text-lg font-semibold transition-all duration-200 ease-in-out hover:bg-stone-700"
							>
								Center Horizontally
							</button>
							<button
								type="button"
								onClick={() => {
									const canvas = canvasRef.current!;
									const w =
										canvas.width /
										(window.devicePixelRatio || 1);
									const h =
										canvas.height /
										(window.devicePixelRatio || 1);
									const targetScale = Math.min(
										w / imgRef.current!.width,
										h / imgRef.current!.height
									);
									animateTo(
										{
											x:
												(w -
													imgRef.current!.width *
														targetScale) /
												2,
											y:
												(h -
													imgRef.current!.height *
														targetScale) /
												2,
										},
										targetScale
									);
								}}
								className="w-full px-2 py-2 mb-4 bg-stone-600 text-white rounded-xl shadow-lg flex items-center justify-center text-xs sm:text-lg font-semibold transition-all duration-200 ease-in-out hover:bg-stone-700"
							>
								Stretch To Fit
							</button>
							<button
								type="button"
								onClick={() => {
									const canvas = canvasRef.current!;
									const w =
										canvas.width /
										(window.devicePixelRatio || 1);
									const h =
										canvas.height /
										(window.devicePixelRatio || 1);
									const targetScale = Math.max(
										w / imgRef.current!.width,
										h / imgRef.current!.height
									);
									animateTo(
										{
											x:
												(w -
													imgRef.current!.width *
														targetScale) /
												2,
											y:
												(h -
													imgRef.current!.height *
														targetScale) /
												2,
										},
										targetScale
									);
								}}
								className="w-full px-2 py-2 mb-4 bg-stone-600 text-white rounded-xl shadow-lg flex items-center justify-center text-xs sm:text-lg font-semibold transition-all duration-200 ease-in-out hover:bg-stone-700"
							>
								Stretch To Fill
							</button>
						</div>

						<button
							type="submit"
							className="w-full px-2 py-2 bg-stone-600 text-white rounded-xl shadow-lg flex items-center justify-center text-2xl font-semibold transition-all duration-200 ease-in-out hover:bg-stone-700"
						>
							Upload
						</button>
					</div>
				)}
			</form>
		</div>
	);
}
