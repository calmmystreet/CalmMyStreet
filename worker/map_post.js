import { json } from 'itty-router';

export default async function handler(request) {
	const body = request.content;

	return json(
		{
			...body,
		},
		{
			status: 200,
			headers: request.newCookies,
		}
	);
}
