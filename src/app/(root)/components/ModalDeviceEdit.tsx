"use client";

import { useEffect, useState } from "react";

import { fetchDeviceUpdate } from "../lib/api";
import { DeviceProps } from "@/app/device/[id]/types/Device";
import { DeviceType, DeviceOrientation } from "@/app/device/[id]/types/enums";
import { Result } from "@/lib/result";

export default function ModalDeviceEdit({
	deviceProps,
	setIsOpen,
	setIsFetchDeviceList,
}: {
	deviceProps: DeviceProps;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsFetchDeviceList: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [originalDevice] = useState<DeviceProps>(deviceProps);
	const [device, setDevice] = useState<DeviceProps>(deviceProps);
	const [error, setError] = useState("");

	function updateDeviceField<K extends keyof DeviceProps>(
		key: K,
		value: DeviceProps[K]
	) {
		setDevice((prev) => ({
			...prev,
			[key]: value,
		}));
	}

	function getModifiedDeviceKeys(
		original: DeviceProps,
		device: DeviceProps
	): (keyof DeviceProps)[] {
		return (Object.keys(original) as (keyof DeviceProps)[]).filter(
			(k) => original[k] !== device[k]
		);
	}

	const handleClickClose = async () => {
		setIsOpen(false);
	};

	const handleClickUpdate = async () => {
		const keys = getModifiedDeviceKeys(originalDevice, device);
		const payload = Object.fromEntries(
			keys.map((k) => [k, device[k]])
		) as Partial<DeviceProps>;

		const result: Result<void> = await fetchDeviceUpdate(
			device.id,
			payload
		);
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
			<div className="fixed inset-0 z-50 flex items-center justify-center px-4">
				{/* Overlay Background */}
				<div
					onClick={handleClickClose}
					className="absolute inset-0 bg-black opacity-50"
				></div>

				{/* Model Content */}
				<div className="relative w-full max-w-sm bg-stone-700 p-6 rounded-2xl shadow-lg text-center items-center justify-center">
					{/* Header */}
					<h2 className="text-2xl text-white uppercase tracking-wider font-semibold mb-4">
						Update Device
					</h2>

					{/* Error messages */}
					{error && (
						<p className="text-l text-red-500 mb-4">{error}</p>
					)}

					<div className="grid grid-cols-[auto_1fr] gap-4 mb-6">
						{/* Device name */}
						<label className="self-center text-right tracking-wide font-semibold">
							Name
						</label>
						<input
							type="text"
							value={device.name}
							onChange={(e) =>
								updateDeviceField("name", e.target.value)
							}
							placeholder="Enter device name"
							className="border rounded-lg p-2 w-full"
						/>

						{/* Device description */}
						<label className="self-center text-right tracking-wide font-semibold">
							Description
						</label>
						<textarea
							value={device.desc}
							onChange={(e) =>
								updateDeviceField("desc", e.target.value)
							}
							placeholder="Enter description"
							className="border rounded-lg p-2 w-full"
						/>

						{/* Device IP */}
						<label className="self-center text-right tracking-wide font-semibold">
							IP
						</label>
						<input
							type="text"
							value={device.ipv4}
							onChange={(e) =>
								updateDeviceField("ipv4", e.target.value)
							}
							placeholder="e.g. 192.168.1.1"
							className="border rounded-lg p-2 w-full"
						/>

						{/* Device Type */}
						<label className="self-center text-right tracking-wide font-semibold">
							Type
						</label>
						<div className="flex items-center">
							<select
								value={device.type}
								onChange={(e) =>
									updateDeviceField(
										"type",
										e.target.value as DeviceType
									)
								}
								className="border rounded-lg p-2 w-full"
							>
								{Object.values(DeviceType).map((value) => (
									<option key={value} value={value}>
										{value.charAt(0).toUpperCase() +
											value.slice(1)}
									</option>
								))}
							</select>
						</div>

						{/* Device Orientation */}
						<label className="self-center text-right tracking-wide font-semibold">
							Orientation
						</label>
						<div className="flex items-center">
							<select
								value={device.orientation}
								onChange={(e) =>
									updateDeviceField(
										"orientation",
										e.target.value as DeviceOrientation
									)
								}
								className="border rounded-lg p-2 w-full"
							>
								{Object.values(DeviceOrientation).map(
									(value) => (
										<option key={value} value={value}>
											{value.charAt(0).toUpperCase() +
												value.slice(1)}
										</option>
									)
								)}
							</select>
						</div>

						{/* Device Is Enabled? */}
						<label className="self-center text-right tracking-wide font-semibold">
							Enable
						</label>
						<div className="flex items-center">
							<label
								onClick={(e) => e.stopPropagation()}
								className="inline-flex items-center cursor-pointer"
							>
								<input
									type="checkbox"
									className="sr-only"
									checked={device.isEnabled}
									onChange={() =>
										updateDeviceField(
											"isEnabled",
											!device.isEnabled
										)
									}
								/>
								<div
									className={`w-12 h-6 rounded-full transition-colors duration-300 ${
										device.isEnabled
											? "bg-green-500"
											: "bg-neutral-400"
									}`}
								>
									<div
										className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ${
											device.isEnabled
												? "translate-x-6"
												: "translate-x-0"
										}`}
									/>
								</div>
							</label>
						</div>
						
						{/* Device Is Draw Grid? */}
						<label className="self-center text-right tracking-wide font-semibold">
							Draw Grid
						</label>
						<div className="flex items-center">
							<label
								onClick={(e) => e.stopPropagation()}
								className="inline-flex items-center cursor-pointer"
							>
								<input
									type="checkbox"
									className="sr-only"
									checked={device.isDrawGrid}
									disabled={device.isEnabled === false}
									onChange={() =>
										updateDeviceField(
											"isDrawGrid",
											!device.isDrawGrid
										)
									}
								/>
								<div
									className={`w-12 h-6 rounded-full transition-colors duration-300 ${
										device.isEnabled ? (
											device.isDrawGrid
												? "bg-green-500"
												: "bg-neutral-400"
										 ) : (
											device.isDrawGrid
												? "bg-green-600"
												: "bg-neutral-500"
										 )
									}`}
								>
									<div
										className={`w-6 h-6 rounded-full shadow transform transition-transform duration-300 ${
											device.isEnabled ? (
												device.isDrawGrid
													? "translate-x-6 bg-white"
													: "translate-x-0 bg-white"									
												) : (
												device.isDrawGrid
													? "translate-x-6 bg-neutral-400"
													: "translate-x-0  bg-neutral-400"										
											)
										}`}
									/>
								</div>
							</label>
						</div>
						
						{/* Device Is Show Time? */}
						<label className="self-center text-right tracking-wide font-semibold">
							Show Time
						</label>
						<div className="flex items-center">
							<label
								onClick={(e) => e.stopPropagation()}
								className="inline-flex items-center cursor-pointer"
							>
								<input
									type="checkbox"
									className="sr-only"
									checked={device.isShowTime}
									disabled={device.isEnabled === false}
									onChange={() =>
										updateDeviceField(
											"isShowTime",
											!device.isShowTime
										)
									}
								/>
								<div
									className={`w-12 h-6 rounded-full transition-colors duration-300 ${
										device.isEnabled ? (
											device.isShowTime
												? "bg-green-500"
												: "bg-neutral-400"
										 ) : (
											device.isShowTime
												? "bg-green-600"
												: "bg-neutral-500"
										 )
									}`}
								>
									<div
										className={`w-6 h-6 rounded-full shadow transform transition-transform duration-300 ${
											device.isEnabled ? (
												device.isShowTime
													? "translate-x-6 bg-white"
													: "translate-x-0 bg-white"									
												) : (
												device.isShowTime
													? "translate-x-6 bg-neutral-400"
													: "translate-x-0  bg-neutral-400"										
											)
										}`}
									/>
								</div>
							</label>
						</div>
					</div>

					{/* Create / Update button */}
					<button
						onClick={handleClickUpdate}
						className="bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-lg w-full mb-4"
					>
						Update
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
