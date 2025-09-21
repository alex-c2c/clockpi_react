"use client";

import { useEffect, useState } from "react";

import { fetchDeviceDelete } from "../lib/api";
import { Result } from "@/lib/result";
import { DeviceProps } from "@/app/device/[id]/types/Device";

export default function ModalDeviceDelete({
	deviceProps,
	setIsOpen,
	setIsFetchDeviceList,
}: {
	deviceProps: DeviceProps;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsFetchDeviceList: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [error, setError] = useState("");

	const handleClickClose = async () => {
		setIsOpen(false);
	};

	const handleClickDelete = async () => {
		// fetch API and await result
		const result: Result<void> = await fetchDeviceDelete(deviceProps.id);
		if (!result.success) {
			setError(result.error);
		} else {
			setIsOpen(false);
			setIsFetchDeviceList(true);
		}
	};

	useEffect(() => {
		const handleEscKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		};

		window.addEventListener("keydown", handleEscKeyDown);

		return () => {
			window.removeEventListener("keydown", handleEscKeyDown);
		};
	}, [setIsOpen]);

	return (
		<div className="relative">
			<div className="fixed inset-0 z-50 flex items-center justify-center">
				{/* Overlay Background */}
				<div
					onClick={handleClickClose}
					className="absolute inset-0 bg-black opacity-50"
				></div>

				{/* Model Content */}
				<div className="relative bg-stone-700 p-6 rounded-2xl shadow-lg text-center items-center justify-center">
					{/* Header */}
					<h2 className="text-2xl text-white uppercase tracking-wider font-semibold mb-4">
						Delete Device
					</h2>

					{/* Error messages */}
					{error && (
						<p className="text-l text-red-500 mb-4">{error}</p>
					)}

					<div className="grid grid-cols-[auto_1fr] gap-4 mb-6">
						<span>
							Are you sure you want to delete{" "}
							<u>
								<b>{deviceProps.name}</b>
							</u>{" "}
							along with all related data?
							<br />
							This action is permanant and irreversible.
						</span>
					</div>

					{/* Delete button */}
					<button
						onClick={handleClickDelete}
						className="bg-red-500 text-white hover:bg-red-600 px-6 py-2 rounded-lg w-full mb-4"
					>
						Delete
					</button>

					{/* Cancel button */}
					<button
						onClick={() => setIsOpen(false)}
						className="bg-neutral-500 text-white hover:bg-neutral-600 px-6 py-2 rounded-lg w-full"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}
