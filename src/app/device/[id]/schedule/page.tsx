"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ScheduleProps } from "./types/Schedule";
import ScheduleCard from "./components/ScheduleCard";
import ModalSleepCreate from "./components/ModalScheduleCreate";
import ModalSleepUpdate from "./components/ModalScheduleUpdate";
import { fetchScheduleList } from "./lib/api";

import { Result } from "@/lib/result";
import { notFound, useParams } from "next/navigation";
import { DeviceProps } from "../types/Device";
import { fetchDevice } from "../lib/api";

export default function SchedulePage() {
	const router = useRouter();
	
	const params = useParams<{ id: string }>();
	if (!params || !/^\d+$/.test(params.id)) {
		notFound();
	}

	const deviceId: number = parseInt(params.id);
	const [error, setError] = useState<string>("");
	
	const [device, setDevice] = useState<DeviceProps | null>(null);
	const [isFetchDevice, setIsFtechDevice] = useState<boolean>(true);
	
	const [isCreateScheduleModalOpen, setIsCreateScheduleModalOpen] =
		useState<boolean>(false);
	const [isUpdateScheduleModalOpen, setIsUpdateScheduleModalOpen] =
		useState<boolean>(false);
	const [selectedSchedule, setSelectedSchedule] =
		useState<ScheduleProps | null>(null);
	const [scheduleList, setScheduleList] = useState<ScheduleProps[]>([]);
	const [isFetchSchedules, setIsFetchSchedules] = useState<boolean>(true);

	useEffect(() => {
		if (!isFetchDevice) return;
		
		const fetch = async () => {
			const result: Result<DeviceProps> = await fetchDevice(deviceId);
			if (result.success) {
				setDevice(result.data);
			}
			else {
				setError(result.error);
			}
			
			setIsFtechDevice(false);
		}
		
		fetch();
	}, [isFetchDevice, deviceId]);
	
	useEffect(() => {
		if (!isFetchSchedules) return;

		const fetch = async () => {
			const result: Result<ScheduleProps[]> = await fetchScheduleList(
				deviceId
			);
			if (result.success) {
				setScheduleList(result.data);
			} else {
				setError(result.error);
			}

			setIsFetchSchedules(false);
		};

		fetch();
	}, [isFetchSchedules, deviceId]);

	useEffect(() => {
		if (error) {
			const timer = setTimeout(() => setError(""), 10000);
			return () => clearTimeout(timer);
		}
	}, [error]);

	const handleClickCard = (id: number) => {
		const schedule: ScheduleProps | undefined = scheduleList.find(
			(item) => item.id === id
		);

		if (schedule === undefined) {
			setSelectedSchedule(null);
			setIsUpdateScheduleModalOpen(false);
		} else {
			setSelectedSchedule(schedule);
			setIsUpdateScheduleModalOpen(true);
		}
	};

	return (
		<div className="flex flex-col items-center pt-4 bg-stone-1000 space-y-4">
			{/* Page Header */}
			<div className="w-full max-w-4xl bg-stone-800 rounded-xl px-4 py-3 flex justify-between items-center">
				<div className="text-3xl text-white font-bold truncate flex items-center gap-4">
					<span
						onClick={() => {router.push(`/`)}}
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
						onClick={() => {router.push(`/device/${deviceId}`)}}
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
						onClick={() => {router.push(`/device/${deviceId}/schedule`)}}
						className="cursor-pointer hover:text-neutral-400"
					>
						Schedule
					</span>
				</div>
				<button
					type="button"
					className="ml-auto p-2 rounded-full text-orange-400 hover:bg-stone-700 transition"
					onClick={(e) => {
						e.stopPropagation();
						setIsCreateScheduleModalOpen(true);
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

			{/* Error label */}
			{error && (
				<div className="w-full max-w-4xl flex items-center justify-between px-4 py-2 rounded-lg shadow-md text-red-500 bg-stone-800 border-2 border-red-500">
					<p className="mr-4">{error}</p>
					<button
						onClick={() => setError("")}
						className="text-red-500 hover:text-red-300 transition duration-200 text-xl font-extrabold leading-none"
						aria-label="Close"
					>
						&times;
					</button>
				</div>
			)}

			{/* Sleep Card List */}
			<div className="w-full max-w-4xl space-y-4">
				{scheduleList.map((schedule, index) => (
					<div
						onClick={() => handleClickCard(schedule.id)}
						key={index}
					>
						<ScheduleCard
							key={schedule.id}
							deviceId={deviceId}
							schedule={schedule}
							setError={setError}
						/>
					</div>
				))}
			</div>

			{isCreateScheduleModalOpen && (
					<ModalSleepCreate
						deviceId={deviceId}
						setIsOpen={setIsCreateScheduleModalOpen}
						setIsFetchSchedules={setIsFetchSchedules}
					/>
				)}
				
			{isUpdateScheduleModalOpen && selectedSchedule != null && (
				<ModalSleepUpdate
					deviceId={deviceId}
					selectedSchedule={selectedSchedule}
					setIsOpen={setIsUpdateScheduleModalOpen}
					setIsFetchSchedules={setIsFetchSchedules}
				/>
			)}
		</div>
	);
}
