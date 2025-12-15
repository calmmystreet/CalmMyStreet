import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = ({ url }) => {
	const uid = url.searchParams.get('uid');

	return { uid };
};
