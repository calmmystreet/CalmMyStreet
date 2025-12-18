import * as jose from 'jose';

const COOKIE_NAME = 'calmmystreet_session';
const TOKEN_DURATION = '2419200'; // 4weeks in seconds

export default async function withSession(request, env) {
	const jwtSecret = env.JWT_SECRET;

	const cookies = request.cookies;
	const sessionToken = cookies[COOKIE_NAME];

	request.newCookies = new Headers();
	let session = await tryDecodeSessionToken(sessionToken, jwtSecret);
	if (!session) {
		session = await generateSessionToken(request.newCookies, jwtSecret);
	}
	request.session = session;
}

async function tryDecodeSessionToken(/*jwt, jwtSecret*/) {
	return false;
}

async function generateSessionToken(newHeadersObj, jwtSecret) {
	const session = crypto.randomUUID();
	const secret = new TextEncoder().encode(jwtSecret);
	const alg = 'HS256';

	const jwt = await new jose.SignJWT()
		.setProtectedHeader({ alg })
		.setIssuedAt()
		.setSubject(session)
		.setExpirationTime(`${TOKEN_DURATION}s`)
		.sign(secret);

	newHeadersObj.append(
		'Set-Cookie',
		`${COOKIE_NAME}=${jwt}; Secure; Max-Age: ${TOKEN_DURATION}; Path=/; `
	);
	return session;
}
