import { NextRequest, NextResponse } from "next/server"


export async function middleware(request: NextRequest) {
	console.log('🛡 Middleware executing for:', request.nextUrl.pathname)

	const session = request.cookies.get('session')

	if (!session) {
		const loginUrl = new URL('/login', request.url)
		loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
		return NextResponse.redirect(loginUrl)
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|login|api|images).*)',
	],
}
