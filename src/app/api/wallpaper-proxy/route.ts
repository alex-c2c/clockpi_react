import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deviceId = searchParams.get("deviceId");
  const wallpaperId = searchParams.get("wallpaperId");

  if (!deviceId || !wallpaperId) {
    return NextResponse.json({ error: "Missing or invalid parameters" }, { status: 400 });
  }

  const url = `${process.env.FLASK_URL}/device/${deviceId}/wallpaper/file?id=${wallpaperId}`;

  try {
    const flaskRes = await fetch(url, {
      headers: {
        "api-key": `${process.env.LOCAL_API_KEY}`,
      },
    });

    if (!flaskRes.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${flaskRes.status}` },
        { status: flaskRes.status },
      );
    }

    const contentType = flaskRes.headers.get("content-type") || "image/bmp";
    const buffer = await flaskRes.arrayBuffer();

    return new NextResponse(Buffer.from(buffer), {
      headers: { "Content-Type": contentType },
    });
  } catch (err) {
    console.error("Image proxy error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
