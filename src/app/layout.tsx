import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import { UserProvider } from "@/context/UserContext";
import fetchSessionUser from "@/lib/api";

const roboto = Roboto({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // adjust weights as needed
});

export const metadata: Metadata = {
	title: "Clock Pi",
	description: "Watch your life counting down with waifu wallpaper!",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
	const user = await fetchSessionUser()

	return (
		<html lang="en" className="h-screen">
			<body className={`${roboto.className} antialiased h-screen m-0 bg-stone-900 text-white`}>
				<div className="flex flex-col h-screen">
					<UserProvider initialUser={user}>
						<Navbar />
						<main className="flex-1 overflow-y-auto">
							{children}
						</main>
					</UserProvider>
				</div>
			</body>
		</html>
	);
}
