import { NextRequest, NextResponse } from "next/server"
import fetchSessionUser from "./lib/api"
import { UserProp } from "@/types/User";

export async function middleware(request: NextRequest) {
	console.debug("Middleware executing for:", request.nextUrl.pathname)
	const user: UserProp | null = await fetchSessionUser()

	if (!user) {
		const loginUrl = new URL("/login", request.url)
		loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
		return NextResponse.redirect(loginUrl)
	}
	
	const response = NextResponse.next();
	response.headers.set("x-user", JSON.stringify(user));
	return response;
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|login|api|images).*)",
	],
}
