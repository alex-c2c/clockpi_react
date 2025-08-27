export function shortenFileName(fileName: string, maxLength: number = 64): string {
	if (fileName.length <= maxLength) return fileName;

	const dotIndex = fileName.lastIndexOf(".");
	if (dotIndex === -1 || dotIndex === 0) return fileName.slice(0, maxLength - 3) + "...";

	const name = fileName.slice(0, dotIndex);
	const ext = fileName.slice(dotIndex);

	const visibleLength = maxLength - ext.length - 3; // 3 for "..."
	const front = name.slice(0, Math.ceil(visibleLength / 2));
	const back = name.slice(-Math.floor(visibleLength / 2));

	return `${front}...${back}${ext}`;
}

export function handleError(error: unknown, context: string = ""): string {
	let message = "An unexpected error occurred";

	if (error instanceof Error) {
		message = error.message;
	}
	else if (typeof error === "string") {
		message = error;
	}

	if (context) {
		console.error(`[${context}]`, error);
	}
	else {
		console.error(error);
	}

	return message;
}
