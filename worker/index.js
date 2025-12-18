import { AutoRouter, error, json, withContent, withCookies } from 'itty-router';

const router = AutoRouter({
	finally: [json],
	catch: error,
});

// form submission
router.post('/api/map', withCookies, withContent, (request, env, ctx) => {
	return { req: { ...request, proxy: null }, env: env, ctx: ctx };
});

export default { ...router };
