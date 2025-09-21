import type { NextApiRequest, NextApiResponse } from "next";

// Cannot use cookies as it will be called outside of a reqquest scope
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { deviceId, wallpaperId } = req.query;

	if (!deviceId || typeof deviceId !== "string") {
		return res.status(400).json({ error: "Missing or invalid device id" });
	}
	
	if (!wallpaperId || typeof wallpaperId !== "string") {
		return res.status(400).json({ error: "Missing or invalid wallpaper id" });
	}

	const url = `${process.env.FLASK_URL}/device/${deviceId}/wallpaper/file?id=${wallpaperId}`;

	try {
		const flaskRes = await fetch(url, {
			method: "GET",
			headers: {
				"api-key": `${process.env.LOCAL_API_KEY}`,
			},
		});

		if (!flaskRes.ok) {
			return res.status(flaskRes.status).end("Failed to fetch image");
		}

		const contentType = flaskRes.headers.get("content-type") || "image/bmp";
		const buffer = await flaskRes.arrayBuffer();

		res.setHeader("Content-Type", contentType);
		res.send(Buffer.from(buffer));
	} catch (err) {
		console.error("Image proxy error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
