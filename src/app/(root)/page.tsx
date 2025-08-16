import TimeDiv from "@/app/(root)/components/TimeDiv"
import EpdDiv from "@/app/(root)/components/EpdDiv";
import WallpaperDiv from "@/app/(root)/components/WallpaperDiv";
import ScheduleDiv from "@/app/(root)/components/ScheduleDiv";

export default function App() {
	return (
		<div className="flex gap-4 flex-col items-center pt-4 bg-stone-1000 mb-4">
			<TimeDiv />
			<EpdDiv />
			<WallpaperDiv />
			<ScheduleDiv />
		</div>
	);
}
