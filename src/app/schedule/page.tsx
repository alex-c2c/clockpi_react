"use client";

import { useEffect, useState } from "react";

import { ScheduleProps } from "@/app/schedule/types/Schedule";
import ScheduleCard from "@/app/schedule/components/ScheduleCard";
import ModalSleepCreate from "@/app/schedule/components/ModalScheduleCreate";
import ModalSleepUpdate from "@/app/schedule/components/ModalScheduleUpdate";
import { Result, safeAsync } from "@/lib/result";

function fetchScheduleList(): Promise<Result<ScheduleProps[]>> {
	return safeAsync(async () => {
		const res = await fetch("/api/schedule", {
			method: "GET",
			credentials: "include",
		});

		const data = await res.json();
		if (!res.ok) {
			throw new Error(`${data.message}`);
		}

		if (Array.isArray(data) && data.length > 0) {
			const schedules: ScheduleProps[] = data
				.sort((a, b) => a.id - b.id)
				.map((item: ScheduleProps) => ({
					id: item.id,
					startTime: item.startTime,
					duration: item.duration,
					days: item.days,
					isEnabled: item.isEnabled,
				}));
			return schedules;
		}

		return [];
	}, "fetchScheduleList");
}

export default function SchedulePage() {
	const [error, setError] = useState<string>("");
	const [isCreateScheduleModalOpen, setIsCreateScheduleModalOpen] =
		useState<boolean>(false);
	const [isUpdateScheduleModalOpen, setIsUpdateScheduleModalOpen] =
		useState<boolean>(false);
	const [selectedSchedule, setSelectedSchedule] =
		useState<ScheduleProps | null>(null);
	const [scheduleList, setScheduleList] = useState<ScheduleProps[]>([]);
	const [isFetchSchedules, setIsFetchSchedules] = useState<boolean>(true);

	useEffect(() => {
		if (!isFetchSchedules) return;

		const fetch = async () => {
			const result: Result<ScheduleProps[]> = await fetchScheduleList();
			if (result.success) {
				setScheduleList(result.data);
			} else {
				setError(result.error);
			}

			setIsFetchSchedules(false);
		};

		fetch();
	}, [isFetchSchedules]);

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
		<div className="flex flex-col items-center pt-4 bg-stone-1000">
			<div className="w-full max-w-4xl bg-stone-800 rounded-xl mb-2 flex flex-col">
				<div className="flex justify-between items-center px-4">
					{/* Sub-Header */}
					<h2 className="text-xl text-white uppercase tracking-widest font-extrabold">
						Sleep Schedule
					</h2>

					{/* "+" button */}
					<div className="relative">
						<button
							onClick={() => setIsCreateScheduleModalOpen(true)}
							className="text-orange-400 text-3xl font-extrabold py-2 rounded hover:text-orange-500"
						>
							+
						</button>

						{isCreateScheduleModalOpen && (
							<ModalSleepCreate
								setIsOpen={setIsCreateScheduleModalOpen}
								setIsFetchSchedules={setIsFetchSchedules}
							/>
						)}
					</div>
				</div>
			</div>

			{/* Error label */}
			{error && (
				<h2 className="w-[640px] flex mt-4 ml-2 text-lg font-mono text-red-500">
					{error}
				</h2>
			)}

			{/* Sleep Card List */}
			{scheduleList.map((schedule, index) => (
				<div
					onClick={() => handleClickCard(schedule.id)}
					key={index}
					className="w-full max-w-4xl "
				>
					<ScheduleCard
						key={schedule.id}
						schedule={schedule}
						setError={setError}
					/>
				</div>
			))}

			{isUpdateScheduleModalOpen && selectedSchedule != null && (
				<ModalSleepUpdate
					selectedSchedule={selectedSchedule}
					setIsOpen={setIsUpdateScheduleModalOpen}
					setIsFetchSchedules={setIsFetchSchedules}
				/>
			)}
		</div>
	);
}
