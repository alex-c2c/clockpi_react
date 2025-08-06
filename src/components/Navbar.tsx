import Link from "next/link";
import NavbarName from "./NavbarName";

export default function Navbar() {
	return (
		<nav className="bg-stone-800 text-white px-4 w-full h-10 flex justify-between items-center shadow-md relative">
			<h1 className="text-xl  font-semibold">
				<Link href={"/"} className="hover:text-gray-300">
					Clock Pi
				</Link>
			</h1>
			<NavbarName />
		</nav>
	);
}
