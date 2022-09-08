

export function notFoundResponse(message: string) {
	throw new Response(message, {
		status: 404,
	});
}