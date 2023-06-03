import type { HandleFetch } from '@sveltejs/kit';
import { API_ADDRESS, CLIENT_API_ADDRESS } from '$env/static/private';

export const handleFetch: HandleFetch = async ({ fetch, request }) => {
	if (request.url.startsWith(CLIENT_API_ADDRESS)) {
		request = new Request(request.url.replace(CLIENT_API_ADDRESS, API_ADDRESS), request);
	}
	console.log(request.url, 'request to');
	return fetch(request);
};
