import { AutoRouter, error, json, withContent, withCookies } from 'itty-router';

const router = AutoRouter({
	finally: [json],
	catch: error,
});

// form submission
router.post('/map', withCookies, withContent, (request, env, ctx) => {
	return { req: request, env: env, ctx: ctx };
});

export default { ...router };
