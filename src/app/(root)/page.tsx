import EpdDiv from "@/app/(root)/components/EpdDiv";
import CarouselDiv from "@/app/(root)/components/CarouselDiv";
import ScheduleDiv from "@/app/(root)/components/ScheduleDiv";

export default function App() {
	return (
		<div className="flex gap-4 flex-col items-center bg-stone-1000 my-4">
			<EpdDiv />
			<CarouselDiv />
			<ScheduleDiv />
		</div>
	);
}
