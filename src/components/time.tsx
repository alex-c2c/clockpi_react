'use client'

import { useEffect, useState } from 'react';

interface TimeResponse {
	time: string;
}

export default function TimeSection() {
	const [serverTime, setServerTime] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchTime = async () => {
			try {
				const res = await fetch('/api/main/time', {
					method: 'GET',
					credentials: 'include',
				});

				const data: TimeResponse = await res.json();
				setServerTime(data.time);
			}
			catch (error) {
				console.error('Failed to fetch time:', error);
			}
			finally {
				setLoading(false);
			}
		};

		fetchTime();
	}, []);

	return (
		<div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
			<h1>🕒 Server Time</h1>
			{loading ? (
				<p>Loading...</p>
			) : (
				<p>Current server time (UTC): {serverTime}</p>
			)}
		</div>
	);
}
