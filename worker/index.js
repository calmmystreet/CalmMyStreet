import { AutoRouter, error, withContent, withCookies } from 'itty-router';
import withSession from './session';
import map_post from './map_post';

const router = AutoRouter({
	catch: error,
});

// form submission
router.post('/api/map', withCookies, withContent, withSession, map_post);

export default { ...router };
