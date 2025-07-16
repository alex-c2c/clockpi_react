import { cookies } from 'next/headers'


export async function getSessionUser() {
	const session = (await cookies()).get('session')
	if (!session) return null

	const res = await fetch(process.env.FLASK_URL + "/auth/session", {
		method: "GET",
		headers: {
			Cookie: `session=${session.value}`,
		},
		credentials: "include",
		cache: "no-store",
	})

	if (!res.ok) {
		return null
	}

	const data = await res.json();

	return data.user;
}
