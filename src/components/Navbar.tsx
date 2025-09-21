import Link from "next/link";
import NavbarName from "@/components/NavbarName";

export default function Navbar() {
	return (
		<nav className="bg-stone-800 px-4 w-full h-14 flex justify-between items-center shadow-md relative">
			<h1 className="text-3xl font-extrabold tracking-widest text-white hover:text-neutral-400">
				<Link href={"/"}>
					Clock Pi
				</Link>
			</h1>
			<NavbarName />
		</nav>
	);
}
