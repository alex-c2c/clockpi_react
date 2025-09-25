/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect, useCallback } from "react";

import {
	WallpaperProps,
	WallpaperUpdateProps,
} from "../types/Wallpaper";
import {
	fetchWallpaperDelete,
	fetchWallpaperUpdate,
} from "../lib/api";

import { Result } from "@/lib/result";
import { DeviceProps } from "../../types/Device";

export default function ModalWallpaperUpdate({
	deviceProps,
	wallpaperProps,
	setIsOpen,
	setIsFetchWallpaperList,
}: {
	deviceProps: DeviceProps;
	wallpaperProps: WallpaperProps;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsFetchWallpaperList: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [id] = useState<number>(wallpaperProps.id);
	const [error, setError] = useState<string | null>(null);
	const imageRef = useRef<HTMLImageElement>(null);

	// Wallpaper settings
	const [textColor, setTextColor] = useState<string>(
		wallpaperProps.color
	);
	const [textShadow, setTextShadow] = useState<string>(
		wallpaperProps.shadow
	);

	const [showTextColor, setShowTextColor] = useState<boolean>(false);
	const [showTextShadow, setShowTextShadow] = useState<boolean>(false);

	const [time] = useState<string>(
		new Date().toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		})
	);

	// for dragging
	const [position, setPosition] = useState({
		xPercent: wallpaperProps.labelXPer,
		yPercent: wallpaperProps.labelYPer,
	});
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const offsetRef = useRef({ x: 0, y: 0 });
	const containerRef = useRef<HTMLDivElement>(null);

	// for sizing
	const BASE_WIDTH = 89;
	const BASE_HEIGHT = 23;
	const ASPECT_RATIO = BASE_HEIGHT / BASE_WIDTH;
	const [size, setSize] = useState({
		width: BASE_WIDTH,
		height: BASE_WIDTH * ASPECT_RATIO,
	});
	const isResizing = useRef(false);
	const scale = Math.max(
		1,
		Math.min(
			size.width / BASE_WIDTH,
			size.height / (BASE_WIDTH * ASPECT_RATIO)
		)
	);
	
	const startResize = (e: React.MouseEvent | React.TouchEvent) => {
		e.stopPropagation(); // Prevent conflict with move drag
		isResizing.current = true;
	};

	const onResize = useCallback(
		(clientX: number, clientY: number) => {
			if (!isResizing.current || !imageRef.current) return;

			const rect = imageRef.current.getBoundingClientRect();

			// Convert percentage position to pixels
			const originX = position.xPercent * rect.width;
			const originY = position.yPercent * rect.height;

			const maxWidth = rect.width - originX;
			const maxHeight = rect.height - originY;

			// Proposed new width and height based on pointer
			let proposedWidth = clientX - rect.left - originX;
			let proposedHeight = clientY - rect.top - originY;

			// Determine new size maintaining aspect ratio
			if (proposedWidth * ASPECT_RATIO > maxHeight) {
				proposedHeight = Math.min(
					maxHeight,
					Math.max(BASE_HEIGHT, proposedHeight)
				);
				proposedWidth = proposedHeight * ASPECT_RATIO;
			} else {
				proposedWidth = Math.min(
					maxWidth,
					Math.max(BASE_WIDTH, proposedWidth)
				);
				proposedHeight = proposedWidth * ASPECT_RATIO;
			}

			setSize({
				width: proposedWidth,
				height: proposedHeight,
			});
		},
		[ASPECT_RATIO, position.xPercent, position.yPercent]
	);

	// Start dragging (mouse or touch)
	const startDrag = (
		e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
	) => {
		if (!imageRef.current) return;

		setIsDragging(true);

		const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
		const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

		const rect = imageRef.current.getBoundingClientRect();

		const pixelX = position.xPercent * rect.width;
		const pixelY = position.yPercent * rect.height;

		offsetRef.current = {
			x: clientX - rect.left - pixelX,
			y: clientY - rect.top - pixelY,
		};
	};

	// Drag move (mouse or touch)
	const onDrag = useCallback(
		(clientX: number, clientY: number) => {
			if (!isDragging || !imageRef.current) return;

			const rect = imageRef.current.getBoundingClientRect();
			const offsetX = clientX - rect.left - offsetRef.current.x;
			const offsetY = clientY - rect.top - offsetRef.current.y;

			const clampedX = Math.max(
				0,
				Math.min(offsetX, rect.width - size.width)
			);
			const clampedY = Math.max(
				0,
				Math.min(offsetY, rect.height - size.height)
			);

			setPosition({
				xPercent: clampedX / rect.width,
				yPercent: clampedY / rect.height
			});
		},
		[isDragging, size.width, size.height]
	);

	const stopDragOrResize = () => {
		setIsDragging(false);
		isResizing.current = false;
	};

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (isResizing.current) {
				onResize(e.clientX, e.clientY);
			} else {
				onDrag(e.clientX, e.clientY);
			}
		},
		[onResize, onDrag]
	);

	const handleTouchMove = useCallback(
		(e: TouchEvent) => {
			if (isResizing.current) {
				onResize(e.touches[0].clientX, e.touches[0].clientY);
			} else {
				onDrag(e.touches[0].clientX, e.touches[0].clientY);
			}
		},
		[onResize, onDrag]
	);

	const handleFetchImageError = () => {
		setError("Unable to fetch wallpaper image");
	};

	const handleClickCenterVertical = () => {
		if (!imageRef.current) return;

		const rect = imageRef.current.getBoundingClientRect();
		setPosition({
			...position,
			yPercent: ((rect.height - size.height) * 0.5) / rect.height,
		});
	};

	const handleClickCenterHorizontal = () => {
		if (!imageRef.current) return;

		const rect = imageRef.current.getBoundingClientRect();
		setPosition({
			...position,
			xPercent: ((rect.width - size.width) * 0.5) / rect.width,
		});
	};

	const handleClickClose = async () => {
		setIsOpen(false);
	};

	const handleClickUpdate = async () => {
		if (!imageRef.current) return;

		const wallpaperUpdateProps: WallpaperUpdateProps = {
			id: id,
			labelXPer: position.xPercent,
			labelYPer: position.yPercent,
			labelWPer: size.width / imageRef.current.width,
			labelHPer: size.height / imageRef.current.height,
			color: textColor,
			shadow: textShadow,
		};

		const result: Result<void> = await fetchWallpaperUpdate(
			deviceProps.id,
			wallpaperUpdateProps
		);
		if (result.success) {
			setIsOpen(false);
			setIsFetchWallpaperList(true);
		} else {
			setError(result.error);
		}
	};

	const handleClickDelete = async () => {
		const result: Result<void> = await fetchWallpaperDelete(deviceProps.id, id);
		if (result.success) {
			setIsOpen(false);
			setIsFetchWallpaperList(true);
		} else {
			setError(result.error);
		}
	};

	useEffect(() => {
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", stopDragOrResize);
		window.addEventListener("touchmove", handleTouchMove);
		window.addEventListener("touchend", stopDragOrResize);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", stopDragOrResize);
			window.removeEventListener("touchmove", handleTouchMove);
			window.removeEventListener("touchend", stopDragOrResize);
		};
	}, [handleMouseMove, handleTouchMove]);

	useEffect(() => {
		if (imageRef.current) {
			const width = imageRef.current.width * wallpaperProps.labelWPer;
			const height =
				imageRef.current.height * wallpaperProps.labelHPer;
			setSize({
				width: width,
				height: height,
			});
		} else {
			setSize({ width: BASE_WIDTH, height: BASE_HEIGHT });
		}
	}, [wallpaperProps.labelWPer, wallpaperProps.labelHPer]);

	return (
		<div className="relative w-full">
			<div className="fixed inset-0 z-50 flex items-center justify-center px-4">
				{/* Overlay Background */}
				<div
					onClick={handleClickClose}
					className="absolute inset-0 bg-black opacity-50"
				></div>

				{/* Model Content */}
				<div className="relative w-full max-w-4xl bg-stone-800 p-6 rounded-2xl shadow-lg text-center items-center justify-center">
					{/* Header */}
					<h2 className="text-xl sm:text-2xl text-white uppercase tracking-wider font-semibold mb-4">
						Modify Wallpaper Time Label
					</h2>

					{/* Error messages */}
					{error && (
						<p className="text-l text-red-500 mb-4">{error}</p>
					)}

					{/* Image with draggable overlay */}
					<div
						className="relative inline-block mb-4"
						ref={containerRef}
					>
						<img
							ref={imageRef}
							src={`/api/wallpaper-proxy?deviceId=${deviceProps.id}&wallpaperId=${id}`}
							alt={`Wallpaper ID: ${id}`}
							className="rounded-xl w-full"
							onError={handleFetchImageError}
							inert
						/>

						{/* Draggable Text Overlay */}
						<div
							className="absolute cursor-move rounded-xl select-none outline-stone-400 outline-4 sm:outline-6"
							style={{
								left: `${position.xPercent * 100}%`,
								top: `${position.yPercent * 100}%`,
								width: `${size.width}px`,
								height: `${size.height}px`,
								touchAction: "none",
								overflow: "hidden",
								position: "absolute",
							}}
							onMouseDown={startDrag}
							onTouchStart={startDrag}
						>
							{/* Inner text scales independently */}
							<div className="w-full h-full flex items-center justify-center relative">
								{/* SHADOW SPAN */}
								<span
									className={`font-time font-bold text-3xl relative
										${
											textShadow === "NONE" ? `` :
												textShadow === "WHITE" ||
												textShadow === "BLACK" ?
													`text-${textShadow.toLowerCase()}`
													:
													`text-${textShadow.toLowerCase()}-500`
										}`}
									style={{
										transform: `scale(${scale})`,
										transformOrigin: "center",
										zIndex: 0,
										opacity: textShadow === "NONE" ? 0 : 100,
									}}
								>
									{time}
								</span>

								{/* FRONT SPAN */}
								<span
									className={`font-time font-bold text-3xl absolute pl-0.5 pb-0.25 sm:pl-0.5 sm:pb-0.25
										${
											textColor === "NONE" ? `` :
												textColor === "WHITE" ||
												textColor === "BLACK" ?
													`text-${textColor.toLowerCase()}`
													:
													`text-${textColor.toLowerCase()}-500`
										}`}
									style={{
										transform: `scale(${scale})`,
										transformOrigin: "center",
										opacity: textColor === "NONE" ? 0 : 100,
									}}
								>
									{time}
								</span>
							</div>

							{/* Resize handle */}
							<div
								onMouseDown={startResize}
								onTouchStart={startResize}
								className={`absolute w-5 h-5 cursor-nwse-resize bg-stone-400 rounded-tl-lg`}
								style={{
									bottom: "0",
									right: "0",
									zIndex: 10,
									pointerEvents: "auto",
									display: "block",
									/* Prevent shifting content inside parent */
									lineHeight: 0,
									fontSize: 0,
								}}
							/>
						</div>
					</div>

					{/* ALIGNMENT BUTTONS */}
					<div className="flex justify-center gap-2 mb-4">
						<button
							onClick={handleClickCenterVertical}
							className="w-full px-2 py-2 rounded-lg bg-stone-600 text-white hover:bg-stone-700 hover:text-neutral-300"
						>
							Center Vertically
						</button>
						<button
							onClick={handleClickCenterHorizontal}
							className="w-full px-2 py-2 rounded-lg bg-stone-600 text-white hover:bg-stone-700 hover:text-neutral-300"
						>
							Center Horizontally
						</button>
					</div>

					<div className="flex justify-center gap-2 mb-4">
						<div className="relative w-full">
							{/* Text Color Button */}
							<button
								onClick={() => setShowTextColor(!showTextColor)}
								className="w-full flex items-center text-center justify-center gap-2 px-3 py-2 rounded-lg bg-stone-600 text-white hover:bg-stone-700"
							>
								<span>Color:</span>
								<span
									className={`w-3 h-3 rounded-full capitalize
										${
											textColor === "NONE" ? `border-2 border-black` :
											textColor === "WHITE" ||
											textColor === "BLACK"
											? `bg-${textColor.toLowerCase()}`
											: `bg-${textColor.toLowerCase()}-500`
										}`}
								/>
								<span>{textColor}</span>
							</button>
							{/* Text Color Dropdown */}
							{showTextColor && (
								<ul className="absolute left-0 mt-2 bg-stone-600 rounded shadow-md z-50 min-w-full">
									{deviceProps.supportedColors.map((color) => (
										<li
											key={color}
											onClick={() => {
												setTextColor(color);
												setShowTextColor(false);
											}}
											className="w-full flex justify-center items-center px-2 py-1 hover:bg-stone-700  gap-2 cursor-pointer text-white"
										>
											<span
												className={`w-3 h-3 rounded-full ${
													color === "NONE" ? `border-2 border-black` :
													color === "WHITE" ||
													color === "BLACK"
														? `bg-${color.toLowerCase()}`
														: `bg-${color.toLowerCase()}-500`
												}`}
											/>
											<span>
												{color}
											</span>
										</li>
									))}
								</ul>
							)}
						</div>

						<div className="relative w-full">
							<div className="w-full">
								{/* Text Shadow Button */}
								<button
									onClick={() =>
										setShowTextShadow(!showTextShadow)
									}
									className="w-full flex items-center text-center justify-center gap-2 px-3 py-2 rounded-lg bg-stone-600 text-white hover:bg-stone-700"
								>
									<span>Shadow: </span>
									<span
										className={`w-3 h-3 rounded-full capitalize
											${
												textShadow === "NONE" ? `border-2 border-black` :
												textShadow === "WHITE" ||
												textShadow === "BLACK"
												? `bg-${textShadow.toLowerCase()}`
												: `bg-${textShadow.toLowerCase()}-500`
											}`}
									/>
									<span>{textShadow}</span>
								</button>
							</div>
							
							{/* Text Shadow Dropdown */}
							{showTextShadow && (
								<ul className="absolute left-0 mt-2 bg-stone-600 rounded shadow-md z-50 min-w-full">
									{deviceProps.supportedColors.map((color) => (
										<li
											key={color}
											onClick={() => {
												setTextShadow(color);
												setShowTextShadow(false);
											}}
											className="w-full flex justify-center items-center px-2 py-1 hover:bg-stone-700  gap-2 cursor-pointer text-white"
										>
											<span
												className={`w-3 h-3 rounded-full ${
													color === "NONE" ? `border-2 border-black` :
													color === "WHITE" ||
													color === "BLACK"
														? `bg-${color.toLowerCase()}`
														: `bg-${color.toLowerCase()}-500`
												}`}
											/>
											<span>{color}</span>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>

					{/* Update Button */}
					<button
						onClick={handleClickUpdate}
						className="w-full px-4 py-2 mb-4 rounded-lg bg-green-500 text-white hover:bg-green-600"
					>
						Update
					</button>

					{/* Delete Button */}
					<button
						onClick={handleClickDelete}
						className="w-full px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}
