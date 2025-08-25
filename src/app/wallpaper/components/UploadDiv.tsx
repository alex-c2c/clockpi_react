"use client"

import { useCallback, useEffect, useRef, useState } from "react";
import { shortenFileName } from "@/lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function UploadDiv() {
	const inputRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [fileDispName, setFileDispName] = useState("No file chosen");
	const [previewURL, setPreviewURL] = useState<string | null>(null);
	const [uploadStatus, setUploadStatus] = useState<string | null>(null);

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const imgRef = useRef<HTMLImageElement | null>(null);

	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const [scale, setScale] = useState(1);

	const MAX_FILE_SIZE_MB = 16;

	const drawImage = useCallback(() => {
		if (!canvasRef.current || !imgRef.current) return;

		const ctx = canvasRef.current.getContext("2d");
		if (!ctx) return;

		const canvas = canvasRef.current;
		const img = imgRef.current;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// === Step 1: Draw blurred background ===
		ctx.save();
		ctx.filter = "blur(4px) brightness(0.7)";

		// Scale image to fill canvas (cover strategy)
		const scaleX = canvas.width / img.width;
		const scaleY = canvas.height / img.height;
		const fillScale = Math.max(scaleX, scaleY);

		const bgWidth = img.width * fillScale;
		const bgHeight = img.height * fillScale;
		const bgX = (canvas.width - bgWidth) / 2;
		const bgY = (canvas.height - bgHeight) / 2;

		ctx.drawImage(img, bgX, bgY, bgWidth, bgHeight);
		ctx.restore();

		// === Step 2: Draw main image with user-controlled offset/scale ===
		ctx.save();
		ctx.beginPath();
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.clip();

		ctx.drawImage(
			img,
			offset.x,
			offset.y,
			img.width * scale,
			img.height * scale
		);

		ctx.restore();
	}, [offset.x, offset.y, scale]);

	const startDragging = (e: React.MouseEvent<HTMLCanvasElement>) => {
		setIsDragging(true);
		setDragStart({ x: e.clientX, y: e.clientY });
	};

	const onDrag = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (!isDragging) return;

		const dx = e.clientX - dragStart.x;
		const dy = e.clientY - dragStart.y;

		setDragStart({ x: e.clientX, y: e.clientY });
		setOffset((prev) => {
			const newOffset = { x: prev.x + dx, y: prev.y + dy };
			return newOffset;
		});
	};

	const stopDragging = () => {
		setIsDragging(false);
	};

	const handleZoom = (e: React.WheelEvent<HTMLCanvasElement>) => {
		//e.preventDefault();
		const delta = e.deltaY < 0 ? 0.05 : -0.05;
		setScale((prev) => {
			const newScale = Math.min(Math.max(prev + delta, 0.1), 5); // clamp
			return newScale;
		});
	};

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
		const file = e.target.files?.[0];
		if (file) handleFile(file);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedFile) return;

		const formData = new FormData();
		formData.append("file", selectedFile);
		formData.append("scale", JSON.stringify(scale));
		formData.append("offsetX", JSON.stringify(offset.x))
		formData.append("offsetY", JSON.stringify(offset.y))

		console.debug("fetchWallpaperUpload");
		try {
			const res = await fetch("/api/wallpaper/upload", {
				method: "POST",
				body: formData,
			});

			console.debug("res");
			console.debug(res);

			if (res.ok) {
				resetFile();
				setUploadStatus("✅ Wallpaper uploaded successfully!");
			} else {
				const j = await res.json();
				console.error(`res error: ${j.message}`);
				setUploadStatus("❌ Upload failed.");
			}
		} catch (err) {
			console.error(`API call failed: ${err}`);
			setUploadStatus("❌ Something went wrong.");
		}
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const file = e.dataTransfer.files?.[0];
		if (file) {
			handleFile(file);
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault(); // Required to allow drop
	};

	const handleFileClick = () => {
		inputRef.current?.click();
	};

	const handleAnimateToCenterHorizontal = () => {
		if (!imgRef.current) return;

		const img = imgRef.current;

		const targetOffsetX = (800 - img.width * scale) / 2;
		const duration = 300; // ms
		const start = performance.now();

		const initialOffset = { ...offset };

		const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
		const easeInOutQuad = (t: number) =>
			t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

		const animate = (time: number) => {
			const elapsed = time - start;
			const tRaw = Math.min(elapsed / duration, 1);
			const t = easeInOutQuad(tRaw);

			const newOffsetX = lerp(initialOffset.x, targetOffsetX, t);

			setOffset({ ...offset, x: newOffsetX });

			if (tRaw < 1) {
				requestAnimationFrame(animate);
			}
		};

		requestAnimationFrame(animate);
	};
	
	const handleAnimateToCenterVertical = () => {
		if (!imgRef.current) return;

		const img = imgRef.current;

		const targetOffsetY = (480 - img.height * scale) / 2;
		const duration = 300; // ms
		const start = performance.now();

		const initialOffset = { ...offset };

		const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
		const easeInOutQuad = (t: number) =>
			t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

		const animate = (time: number) => {
			const elapsed = time - start;
			const tRaw = Math.min(elapsed / duration, 1);
			const t = easeInOutQuad(tRaw);

			const newOffsetY = lerp(initialOffset.y, targetOffsetY, t);
			setOffset({ ...offset, y: newOffsetY });

			if (tRaw < 1) {
				requestAnimationFrame(animate);
			}
		};

		requestAnimationFrame(animate);
	};

	const handleAnimateToFit = () => {
		if (!imgRef.current) return;

		const img = imgRef.current;

		const targetScale = Math.min(800 / img.width, 480 / img.height);
		const targetOffset = {
			x: (800 - img.width * targetScale) / 2,
			y: (480 - img.height * targetScale) / 2,
		};

		const duration = 300; // ms
		const start = performance.now();

		const initialOffset = { ...offset };
		const initialScale = scale;

		const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
		const easeInOutQuad = (t: number) =>
			t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

		const animate = (time: number) => {
			const elapsed = time - start;
			const tRaw = Math.min(elapsed / duration, 1);
			const t = easeInOutQuad(tRaw);

			const newOffset = {
				x: lerp(initialOffset.x, targetOffset.x, t),
				y: lerp(initialOffset.y, targetOffset.y, t),
			};

			const newScale = lerp(initialScale, targetScale, t);

			setOffset(newOffset);
			setScale(newScale);

			if (tRaw < 1) {
				requestAnimationFrame(animate);
			}
		};

		requestAnimationFrame(animate);
	};
	
	const handleAnimateToFill = () => {
		if (!imgRef.current) return;

		const img = imgRef.current;

		const targetScale = Math.max(800 / img.width, 480 / img.height);
		const targetOffset = {
			x: (800 - img.width * targetScale) / 2,
			y: (480 - img.height * targetScale) / 2,
		};

		const duration = 300; // ms
		const start = performance.now();

		const initialOffset = { ...offset };
		const initialScale = scale;

		const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
		const easeInOutQuad = (t: number) =>
			t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

		const animate = (time: number) => {
			const elapsed = time - start;
			const tRaw = Math.min(elapsed / duration, 1);
			const t = easeInOutQuad(tRaw);

			const newOffset = {
				x: lerp(initialOffset.x, targetOffset.x, t),
				y: lerp(initialOffset.y, targetOffset.y, t),
			};

			const newScale = lerp(initialScale, targetScale, t);

			setOffset(newOffset);
			setScale(newScale);

			if (tRaw < 1) {
				requestAnimationFrame(animate);
			}
		};

		requestAnimationFrame(animate);
	};
	
	

	// Clean up preview URL
	useEffect(() => {
		return () => {
			if (previewURL) URL.revokeObjectURL(previewURL);
		};
	}, [previewURL]);

	// auto dismiss status bar after 3000ms
	useEffect(() => {
		if (uploadStatus) {
			const timer = setTimeout(() => {
				setUploadStatus(null);
			}, 10000);

			return () => clearTimeout(timer);
		}
	}, [uploadStatus])

	useEffect(() => {
		if (!previewURL) return;

		const img = new Image();
		img.src = previewURL;

		img.onload = () => {
			imgRef.current = img;

			// Fit image within canvas initially
			const scaleFactor = Math.min(800 / img.width, 480 / img.height);
			setScale(scaleFactor);

			// Center image
			const centerX = (800 - img.width * scaleFactor) / 2;
			const centerY = (480 - img.height * scaleFactor) / 2;
			setOffset({ x: centerX, y: centerY });
		};

		return () => {
			imgRef.current = null;
		};
	}, [previewURL]);

	useEffect(() => {
		drawImage();
	}, [offset, scale, previewURL, drawImage]);

	return (
		<div className="w-full max-w-4xl p-4 sm:p-6 mx-auto bg-stone-800 rounded-2xl flex flex-col justify-center">
			<h2 className="text-xl sm:text-xl text-white mb-2 self-start uppercase tracking-widest font-extrabold">
				Upload Wallpaper
			</h2>
			<div className="w-full h-px bg-white opacity-30 mb-6" />

			<form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
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
					onClick={handleFileClick}
					className="w-full border-2 border-dashed border-white rounded-xl p-6 text-white text-center cursor-pointer hover:bg-stone-700 transition"
				>
					<p className="text-white">Drag & drop image here, or click to select</p>
					<p className="text-sm mt-2 text-stone-300">{fileDispName}</p>
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
										className="absolute top-2 right-8 z-10 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full p-1"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={2}
											stroke="currentColor"
											className="w-5 h-5 text-white hover:text-red-400 transition-colors duration-200"
										>
											<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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

						<canvas
							ref={canvasRef}
							width={800}
							height={480}
							className="border rounded-lg bg-black"
							style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
							onMouseDown={startDragging}
							onMouseMove={onDrag}
							onMouseUp={stopDragging}
							onMouseLeave={stopDragging}
							onWheel={handleZoom}
						/>
					</div>
				)}

				{/* Center Image Button */}
				{previewURL && (
					<div className="">
						<div className="flex justify-center gap-2">
							<button
								type="button"
								onClick={handleAnimateToCenterVertical}
								className="w-full px-2 py-2 mb-4 bg-stone-600 text-white rounded-xl shadow-lg flex items-center justify-center text-xs sm:text-lg font-semibold transition-all duration-200 ease-in-out hover:bg-stone-700"
							>
								Center Vertically
							</button>
							<button
								type="button"
								onClick={handleAnimateToCenterHorizontal}
								className="w-full px-2 py-2 mb-4 bg-stone-600 text-white rounded-xl shadow-lg flex items-center justify-center text-xs sm:text-lg font-semibold transition-all duration-200 ease-in-out hover:bg-stone-700"
							>
								Center Horizontally
							</button>
							<button
								type="button"
								onClick={handleAnimateToFit}
								className="w-full px-2 py-2 mb-4 bg-stone-600 text-white rounded-xl shadow-lg flex items-center justify-center text-xs sm:text-lg font-semibold transition-all duration-200 ease-in-out hover:bg-stone-700"
							>
								Stretch To Fit
							</button>
							<button
								type="button"
								onClick={handleAnimateToFill}
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
