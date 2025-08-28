import { cookies } from "next/headers";
import { ButtonScheduleEdit } from "@/app/(root)/components/Buttons";
import { Result, safeAsync } from "@/lib/result";

function fetchScheduleStatus(): Promise<Result<boolean>> {
	return safeAsync(async () => {
		const session = (await cookies()).get("session");

		const res = await fetch(`${process.env.FLASK_URL}/schedule/status`, {
			method: "GET",
			headers: {
				Cookie: `session=${session?.value}`,
			},
			credentials: "include",
		});

		if (!res.ok) {
			const data = await res.json();
			throw new Error(`${data.message}`);
		}

		const data = await res.json();
		return data.isSleep;
	}, "fetchScheduleStatus");
}

export default async function ScheduleDiv() {
	const isSleep = await fetchScheduleStatus();

	return (
		<div className="w-full max-w-4xl p-4 sm:p-6 mx-auto bg-stone-800 rounded-2xl flex flex-col justify-center">
			<h2 className="text-xl sm:text-xl text-white mb-2 self-start uppercase tracking-widest font-extrabold">
				Sleep Schedule
			</h2>
			<div className="w-full h-px bg-white opacity-30 mb-6" />
			<div className="flex space-x-2">
				<p className="text-l text-white mb-4 p-0.5 tracking-wider font-semibold">
					Current Status:
				</p>
				{isSleep ? (
					<p className="text-l text-green-400 bg-gray-500 rounded-2xl px-2 py-0.5 mb-4 tracking-wider font-extrabold">
						Sleeping
					</p>
				) : (
					<p className="text-l text-white bg-gray-500 rounded-2xl px-2 py-0.5 mb-4 tracking-wider font-extrabold">
						Awake
					</p>
				)}
			</div>
			<ButtonScheduleEdit />
		</div>
	);
}
