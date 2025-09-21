"use client";

import { useEffect, useState } from "react";

import { DeviceProps } from "@/app/device/[id]/types/Device";

import ModalDeviceCreate from "./components/ModalDeviceCreate";
import ModalDeviceEdit from "./components/ModalDeviceEdit";
import ModalDeviceDelete from "./components/ModalDeviceDelete";
import DeviceCard from "./components/DeviceCard";
import { fetchDeviceList } from "./lib/api";

import { Result } from "@/lib/result";
import { useRouter } from "next/navigation";

export default function App() {
	const router = useRouter();

	const [error, setError] = useState<string>("");
	const [isModalDeviceCreateOpen, setIsModalDeviceCreateOpen] =
		useState<boolean>(false);
	const [isModalDeviceEditOpen, setIsModalDeviceEditOpen] =
		useState<boolean>(false);
	const [isModalDeviceDeleteOpen, setIsModalDeviceDeleteOpen] =
		useState<boolean>(false);
	const [selectedDevice, setSelectedDevice] = useState<DeviceProps | null>(
		null
	);
	const [deviceList, setDeviceList] = useState<DeviceProps[]>([]);
	const [isFetchDeviceList, setIsFetchDeviceList] = useState<boolean>(true);

	const handleClickCard = (id: number) => {
		router.push(`/device/${id}`);
	};

	const handleClickEdit = (id: number) => {
		const deviceProps: DeviceProps | undefined = deviceList.find(
			(item) => item.id === id
		);

		if (deviceProps === undefined) {
			setSelectedDevice(null);
			setIsModalDeviceEditOpen(false);
		} else {
			setSelectedDevice(deviceProps);
			setIsModalDeviceEditOpen(true);
		}
	};

	const handleClickDelete = (id: number) => {
		const deviceProps: DeviceProps | undefined = deviceList.find(
			(item) => item.id === id
		);

		if (deviceProps === undefined) {
			setSelectedDevice(null);
			setIsModalDeviceDeleteOpen(false);
		} else {
			setSelectedDevice(deviceProps);
			setIsModalDeviceDeleteOpen(true);
		}
	};

	useEffect(() => {
		if (!isFetchDeviceList) return;

		const fetch = async () => {
			const result: Result<DeviceProps[]> = await fetchDeviceList();
			if (result.success) {
				setDeviceList(result.data);
			} else {
				setError(result.error);
			}

			setIsFetchDeviceList(false);
		};

		fetch();
	}, [isFetchDeviceList]);

	return (
		<div className="flex flex-col items-center pt-4 bg-stone-1000">
			{/* Error label */}
			{error && (
				<h2 className="w-full max-w-4xl flex my-4 ml-2 text-lg font-mono text-red-500">
					{error}
				</h2>
			)}

			{/* Header */}
			<div className="w-full max-w-4xl bg-stone-800 rounded-xl px-4 py-3 mb-2 flex justify-between items-center">
				{/* Devices */}
				<div className="text-3xl text-white font-bold truncate">
					<span
						onClick={() => {router.push(`/`)}}
						className="cursor-pointer hover:text-neutral-400"
					>
						Devices
					</span>
				</div>

				{/* Create button */}
				<button
					type="button"
					className="ml-auto p-2 rounded-full text-orange-400 hover:bg-stone-700 transition"
					onClick={(e) => {
						e.stopPropagation();
						setIsModalDeviceCreateOpen(true);
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={4}
							d="M12 4v16m8-8H4"
						/>
					</svg>
				</button>
			</div>

			{/* Device Card List */}
			{deviceList.map((device, index) => (
				<div
					onClick={() => handleClickCard(device.id)}
					key={index}
					className="w-full max-w-4xl "
				>
					<DeviceCard
						deviceProps={device}
						onEdit={handleClickEdit}
						onDelete={handleClickDelete}
					/>
				</div>
			))}

			{isModalDeviceCreateOpen && (
				<ModalDeviceCreate
					setIsOpen={setIsModalDeviceCreateOpen}
					setIsFetchDeviceList={setIsFetchDeviceList}
				/>
			)}

			{isModalDeviceEditOpen && selectedDevice != null && (
				<ModalDeviceEdit
					deviceProps={selectedDevice}
					setIsOpen={setIsModalDeviceEditOpen}
					setIsFetchDeviceList={setIsFetchDeviceList}
				/>
			)}

			{isModalDeviceDeleteOpen && selectedDevice != null && (
				<ModalDeviceDelete
					deviceProps={selectedDevice}
					setIsOpen={setIsModalDeviceDeleteOpen}
					setIsFetchDeviceList={setIsFetchDeviceList}
				/>
			)}
		</div>
	);
}
