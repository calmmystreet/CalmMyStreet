import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = ({ url }) => {
	const oid = url.searchParams.get('oid');

	return { oid };
};
