import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import { UserProvider } from "@/context/UserContext";
import { getSessionUser } from "@/Utils";


const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});


const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});


export const metadata: Metadata = {
	title: "Clock Pi",
	description: "Watch your life counting down with waifu wallpaper!",
};


export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
	const user = await getSessionUser()

	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<UserProvider initialUser={user}>
					<Navbar />
					{children}
				</UserProvider>
			</body>
		</html>
	);
}
