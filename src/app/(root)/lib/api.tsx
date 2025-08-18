'use client'

export async function fetchQueueNext(
	setIsFetchQueue: React.Dispatch<React.SetStateAction<boolean>>,
	setError: React.Dispatch<React.SetStateAction<string>> | null = null
) {
	console.debug("fetchQueueNext");

	try {
		const res = await fetch("/api/queue/next", {
			method: "GET",
			credentials: "include",
		});

		console.debug("res");
		console.debug(res);

		if (res.ok) {
			setIsFetchQueue(true);
		}
		else {
			const j = await res.json();
			console.error(`res error: ${JSON.stringify(j)}`);

			if (setError) {
				setError(`${j.message}`);
			}
		}
	}
	catch (err) {
		console.error("Error calling /api/queue/next", err);
		if (setError) {
			setError(`${err}`);
		}
	}
};


export async function fetchQueueShuffle(
	setIsFetchQueue: React.Dispatch<React.SetStateAction<boolean>>,
	setError: React.Dispatch<React.SetStateAction<string>> | null = null
) {
	console.debug("fetchQueueShuffle");

	try {
		const res = await fetch("/api/queue/shuffle", {
			method: "GET",
			credentials: "include",
			cache: "no-store"
		});

		console.debug("res");
		console.debug(res);

		if (res.ok) {
			setIsFetchQueue(true);
		}
		else {
			const j = await res.json();
			console.error(`res error: ${JSON.stringify(j)}`);
			if (setError) {
				setError(j.message);
			}
		}
	}
	catch (err) {
		console.error("Error calling /api/queue/next", err);
		if (setError) {
			setError(`${err}`);
		}
	}
}


export async function fetchQueue(
	setQueue: React.Dispatch<React.SetStateAction<number[]>>,
	setError: React.Dispatch<React.SetStateAction<string>>
) {
	console.debug("fetchQueue");

	try {
		const res = await fetch("/api/queue", {
			method: "GET",
			credentials: "include",
			cache: "no-store",
		});

		console.debug("res");
		console.debug(res);

		const j = await res.json()
		if (!res.ok) {
			console.error(`res error: ${JSON.stringify(j)}`);
			setError(j.message);
		}
		else {
			setQueue(j);
			setError("");
		}
	}
	catch (err) {
		console.error(`API call failed: ${err}`);
		setError(`${err}`);
	}
}
