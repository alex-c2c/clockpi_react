import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Navbar from "@/components/Navbar";
import { UserProvider } from "@/context/UserContext";
import { UserProp } from "@/types/User";
import { headers } from "next/headers";

const roboto = Roboto({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // adjust weights as needed
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

export const metadata: Metadata = {
	title: "Clock Pi",
	description: "Watch your life counting down with waifu wallpaper!",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
	const userHeader: string | null = (await headers()).get("x-user");
	const user: UserProp | null = userHeader ? JSON.parse(userHeader) : null;
	
	return (		
		<html lang="en" className="h-screen">
			<body className={`${roboto.className} ${robotoMono.variable} antialiased h-screen bg-stone-900 text-white`}>
				<div className="flex flex-col h-screen">
					<UserProvider initialUser={user}>
						<Navbar />
						<main className="flex-1 overflow-y-auto px-4">
							{children}
						</main>
					</UserProvider>
				</div>
			</body>
		</html>
	);
}
