import TimeDiv from "@/app/(root)/components/TimeDiv"
import EpdDiv from "@/app/(root)/components/EpdDiv";
import WallpaperDiv from "@/app/(root)/components/WallpaperDiv";
import SleepDiv from "@/app/(root)/components/SleepDiv";

export default function App() {
	return (
		<div className="flex gap-4 flex-col items-center pt-4 bg-stone-1000 mb-4">
			<TimeDiv />
			<EpdDiv />
			<WallpaperDiv />
			<SleepDiv />
		</div>
	);
}
