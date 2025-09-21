"use client";

import { useEffect, useState } from "react";

import { DeviceCreateProps } from "@/app/device/[id]/types/Device";
import { fetchDeviceCreate } from "../lib/api";
//import { checkDataValidity, getEndTime } from "../lib/utils";
import { Result } from "@/lib/result";
import { DeviceOrientation, DeviceType } from "@/app/device/[id]/types/enums";

export default function ModalDeviceCreate({
	setIsOpen,
	setIsFetchDeviceList,
}: {
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsFetchDeviceList: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [name, setName] = useState<string>("");
	const [desc, setDesc] = useState<string>("");
	const [ipv4, setIpv4] = useState<string>("");
	const [type, setType] = useState<DeviceType>(DeviceType.epd7in3e);
	const [orientation, setOrientation] = useState<DeviceOrientation>(
		DeviceOrientation.Horizontal
	);
	const [error, setError] = useState("");

	const handleClickClose = async () => {
		setIsOpen(false);
	};

	const handleClickCreate = async () => {
		// validate data before fetching API
		// const dataError: string | null = checkDataValidity(startTime, duration, days);
		// if (dataError != null) {
		// 	setError(dataError);
		// 	return;
		// }

		// convert data to object
		const deviceCreateProps: DeviceCreateProps = {
			name: name,
			desc: desc,
			ipv4: ipv4,
			type: type,
			orientation: orientation,
		};

		// fetch API and await result
		const result: Result<void> = await fetchDeviceCreate(deviceCreateProps);
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
						New Device
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
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter device name"
							className="border rounded-lg p-2 w-full"
						/>

						{/* Device description */}
						<label className="self-center text-right tracking-wide font-semibold">
							Description
						</label>
						<textarea
							value={desc}
							onChange={(e) => setDesc(e.target.value)}
							placeholder="Enter description"
							className="border rounded-lg p-2 w-full"
						/>

						{/* Device IP */}
						<label className="self-center text-right tracking-wide font-semibold">
							IP
						</label>
						<input
							type="text"
							value={ipv4}
							onChange={(e) => setIpv4(e.target.value)}
							placeholder="e.g. 192.168.1.1"
							className="border rounded-lg p-2 w-full"
						/>

						{/* Device Type */}
						<label className="self-center text-right tracking-wide font-semibold">
							Type
						</label>
						<div className="flex items-center">
							<select
								value={type}
								onChange={(e) =>
									setType(e.target.value as DeviceType)
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
								value={orientation}
								onChange={(e) =>
									setOrientation(
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
					</div>

					{/* Create button */}
					<button
						onClick={handleClickCreate}
						className="bg-green-600 text-white hover:bg-green-700 hover:text-neutral-300 px-6 py-2 mb-4 rounded-lg w-full"
					>
						Create
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
