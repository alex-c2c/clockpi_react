/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useRef, useState } from "react";
import { shortenFileName } from "@/lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function UploadDiv() {
	const inputRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [fileDispName, setFileDispName] = useState("No file chosen");
	const [previewURL, setPreviewURL] = useState<string | null>(null);
	const [uploadStatus, setUploadStatus] = useState("");

	const MAX_FILE_SIZE_MB = 16;

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

	const resetFile = () => {
		setSelectedFile(null);
		setFileDispName("No file chosen");
		setPreviewURL(null);
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

		try {
			const res = await fetch("/api/wallpaper/upload", {
				method: "POST",
				body: formData,
			});

			if (res.ok) {
				setUploadStatus("✅ Wallpaper uploaded successfully!");
			} else {
				setUploadStatus("❌ Upload failed.");
			}
		} catch (err) {
			console.error(err);
			setUploadStatus("❌ Something went wrong.");
		}
	};

	// Clean up preview URL
	useEffect(() => {
		return () => {
			if (previewURL) URL.revokeObjectURL(previewURL);
		};
	}, [previewURL]);

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

	return (
		<div className="w-[800px] bg-stone-800 rounded-2xl p-6 flex flex-col justify-center">
			<h2 className="text-xl text-white mb-2 self-start uppercase tracking-widest font-extrabold">
				Upload Wallpaper
			</h2>
			<div className="w-full h-px bg-white opacity-30 mb-6" />

			<form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
				{uploadStatus && (
					<p className="text-white bg-stone-700 px-4 py-2 rounded">{uploadStatus}</p>
				)}

				{/* Drag and drop zone */}
				<div
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onClick={handleFileClick}
					className="w-full border-2 border-dashed border-white rounded-lg p-6 text-white text-center cursor-pointer hover:bg-stone-700 transition"
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
					<div className="relative w-full">
						{/* Fancy Close Button (top-right) */}
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


						<img
							src={previewURL}
							alt="Image preview"
							className="w-full h-auto object-contain rounded-lg"
						/>
					</div>
				)}

				{/* Submit Button */}
				<button
					type="submit"
					className="w-full h-[50px] bg-stone-600 text-white rounded-xl shadow-lg flex items-center justify-center text-2xl font-semibold transition-all duration-200 ease-in-out hover:bg-stone-700"
				>
					Upload
				</button>
			</form>
		</div>
	);
}
