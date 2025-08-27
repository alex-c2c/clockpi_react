export type Result<T> =
	| { success: true; data: T }
	| { success: false; error: string };


export async function safeAsync<T>(
	fn: () => Promise<T>,
	context: string = ""
): Promise<Result<T>>
{
	try {
		const data = await fn();
		return { success: true, data };
	}
	catch (err: unknown) {
		let message = "An unexpected error occurred";
		
		if (err instanceof Error) {
			message = err.message;
		}
		else if (typeof err === "string") {
			message = err;
		}

		if (context) {
			console.error(`[${context}]`, err);
		}
		else {
			console.error(err);
		}

		return { success: false, error: message };
	}
}
