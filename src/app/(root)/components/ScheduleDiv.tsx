import { cookies } from "next/headers";
import { ButtonScheduleEdit } from "@/app/(root)/components/Buttons";

export default async function ScheduleDiv() {
	let isSleep = false;
	let isError = false;

	try {
		const session = (await cookies()).get("session")

		const res = await fetch(`${process.env.FLASK_URL}/schedule/status`, {
			method: "GET",
			headers: {
				Cookie: `session=${session?.value}`,
			},
			credentials: "include",
			cache: "no-store",
		});

		if (!res.ok) {
			isError = true;
			console.error("Unable to get schedule data");
		}
		else {
			const j = await res.json()
			isSleep = j.isSleep;
		}
	}
	catch (err) {
		isError = true;
		console.error("Error fetching /schedule/status", err);
	}

	return (
		<div className="w-[640px] bg-stone-800 rounded-2xl p-6 flex flex-col justify-center">
			<h2 className="text-xl text-white mb-2 self-start uppercase tracking-widest font-extrabold">
				Sleep Schedule
			</h2>
			<div className="w-full h-px bg-white opacity-30 mb-6" />
			<div className="flex space-x-2">
				<p className="text-l text-white mb-4 p-0.5 tracking-wider font-semibold">Current Status:</p>
				{isError ? (
					<p className="text-l text-red-500 bg-gray-500 rounded-2xl px-2 py-0.5 mb-4 tracking-wider font-extrabold">Error</p>
				) : isSleep ? (
					<p className="text-l text-green-400 bg-gray-500 rounded-2xl px-2 py-0.5 mb-4 tracking-wider font-extrabold">Sleeping</p>
				) : (
					<p className="text-l text-white bg-gray-500 rounded-2xl px-2 py-0.5 mb-4 tracking-wider font-extrabold">Awake</p>
				)}
			</div>
			<ButtonScheduleEdit />
		</div>
	);
}
