"use client";

import { useEffect, useState } from "react";

import UploadDiv from "./components/UploadDiv";
import GridDiv from "./components/GridDiv";
import { WallpaperProps } from "./types/Wallpaper";
import { fetchWallpaperList } from "./lib/api";

import { Result } from "@/lib/result";
import { notFound, useParams, useRouter } from "next/navigation";
import { fetchDevice } from "../lib/api";
import { DeviceProps } from "../types/Device";
import ModalWallpaperUpdate from "./components/ModalWallpaperUpdate";
import ModalWallpaperDeleteAll from "./components/ModalWallpaperDeleteAll";

export default function WallpaperPage() {
	const router = useRouter();

	const params = useParams<{ id: string }>();
	if (!params || !/^\d+$/.test(params.id)) {
		notFound();
	}

	const deviceId: number = parseInt(params.id);
	const [device, setDevice] = useState<DeviceProps | null>(null);

	const [isFetchDevice, setIsFetchDevice] = useState<boolean>(true);
	const [isFetchWallpaperList, setIsFetchWallpaperList] =
		useState<boolean>(true);
	const [isModalUpdateOpen, setIsModalUpdateOpen] = useState<boolean>(false);
	const [isModalDeleteAllOpen, setIsModalDeleteAllOpen] =
		useState<boolean>(false);

	const [selectedWallpaper, setSelectedWallpaper] =
		useState<WallpaperProps | null>(null);
	const [wallpaperList, setWallpaperList] = useState<WallpaperProps[]>([]);

	const openWallpaperCard = (wallpaperId: number) => {
		const wallpaper: WallpaperProps | undefined = wallpaperList.find(
			(item) => item.id === wallpaperId
		);

		if (wallpaper) {
			setSelectedWallpaper(wallpaper);
			setIsModalUpdateOpen(true);
		}
	};

	const clearAllWallpapers = () => {
		setWallpaperList([]);
	};

	useEffect(() => {
		if (!isFetchDevice) return;

		const fetch = async () => {
			const result: Result<DeviceProps> = await fetchDevice(deviceId);
			if (result.success) {
				setDevice(result.data);
			} else {
				notFound();
			}

			setIsFetchDevice(false);
		};

		fetch();
	}, [isFetchDevice, deviceId]);

	useEffect(() => {
		if (!isFetchWallpaperList) return;

		const fetch = async () => {
			const result: Result<WallpaperProps[]> = await fetchWallpaperList(
				deviceId
			);
			if (result.success) {
				setWallpaperList(result.data);
			}

			setIsFetchWallpaperList(false);
		};

		fetch();
	}, [isFetchWallpaperList, deviceId]);
	
	// Close menu on ESC press
	useEffect(() => {
		const handleEscKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsModalDeleteAllOpen(false);
				setIsModalUpdateOpen(false);
			}
		};

		window.addEventListener("keydown", handleEscKeyDown);

		return () => {
			window.removeEventListener("keydown", handleEscKeyDown);
		};
	});

	return (
		<>
			{device ? (
				<div className="flex gap-4 flex-col items-center pt-4 bg-stone-1000 mb-4">
					{/* Page Header */}
					<div className="w-full max-w-4xl bg-stone-800 rounded-xl px-4 py-3 flex justify-between items-center">
						<div className="text-3xl text-white font-bold truncate flex items-center gap-4">
							<span
								onClick={() => {
									router.push(`/`);
								}}
								className="cursor-pointer hover:text-neutral-400"
							>
								Devices
							</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 text-neutral-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={3}
									d="M13 5l7 7-7 7M5 5l7 7-7 7"
								/>
							</svg>
							<span
								onClick={() => {
									router.push(`/device/${deviceId}`);
								}}
								className="cursor-pointer hover:text-neutral-400"
							>
								{device?.name}
							</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 text-neutral-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={3}
									d="M13 5l7 7-7 7M5 5l7 7-7 7"
								/>
							</svg>
							<span
								onClick={() => {
									router.push(
										`/device/${deviceId}/wallpaper`
									);
								}}
								className="cursor-pointer hover:text-neutral-400"
							>
								Wallpaper
							</span>
						</div>
					</div>

					{/* Upload */}
					<UploadDiv
						deviceId={deviceId}
						setIsFetchWallpaperList={setIsFetchWallpaperList}
					/>

					{/* Grid */}
					<GridDiv
						deviceId={device.id}
						wallpaperList={wallpaperList}
						onClickCardCallback={openWallpaperCard}
						onClickDeleteAllCallback={() => {
							setIsModalDeleteAllOpen(true);
						}}
					/>

					{/* Modal Update */}
					{isModalUpdateOpen && selectedWallpaper != null && (
						<ModalWallpaperUpdate
							deviceProps={device}
							wallpaperProps={selectedWallpaper}
							setIsOpen={setIsModalUpdateOpen}
							setIsFetchWallpaperList={setIsFetchWallpaperList}
						/>
					)}

					{/* Modal Delete All */}
					{isModalDeleteAllOpen && (
						<ModalWallpaperDeleteAll
							deviceId={device.id}
							deviceName={device.name}
							setIsOpen={setIsModalDeleteAllOpen}
							onDeleteAllCallback={() => {setWallpaperList([]);}}
						/>
					)}
				</div>
			) : (
				<div className="flex gap-4 flex-col items-center pt-4 bg-stone-1000 mb-4"></div>
			)}
		</>
	);
}
