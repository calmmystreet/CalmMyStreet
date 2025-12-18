import * as jose from 'jose';

const COOKIE_NAME = 'calmmystreet_session';
const TOKEN_DURATION = '2419200'; // 4weeks in seconds
const ALGORITHM = 'HS256';

export default async function withSession(request, env) {
	const jwtSecret = env.JWT_SECRET;

	const cookies = request.cookies;
	const sessionToken = cookies[COOKIE_NAME];

	request.newCookies = new Headers();
	let session = await tryDecodeSessionToken(request.newCookies, sessionToken, jwtSecret);
	if (!session) {
		session = await generateSessionToken(request.newCookies, jwtSecret);
	}
	request.session = session;
}

async function tryDecodeSessionToken(newHeadersObj, jwt, jwtSecret) {
	if (!jwt) {
		return; // no token to parse
	}
	const secret = encodeJwtSecret(jwtSecret);
	const { payload } = await jose.jwtVerify(jwt, secret, {
		algorithms: [ALGORITHM],
	});
	// TODO: slap a .catch() on this and log an error and reassign the session token
	if (payload && payload.sub) {
		await signAndSetCookie(payload.sub, newHeadersObj, jwtSecret);
		return payload.sub;
	}
}

async function generateSessionToken(newHeadersObj, jwtSecret) {
	const session = crypto.randomUUID(); // create session
	await signAndSetCookie(session, newHeadersObj, jwtSecret);
	return session;
}

async function signAndSetCookie(session, newHeadersObj, jwtSecret) {
	// sign session
	const secret = encodeJwtSecret(jwtSecret);

	const jwt = await new jose.SignJWT()
		.setProtectedHeader({ alg: ALGORITHM })
		.setIssuedAt()
		.setSubject(session)
		.setExpirationTime(`${TOKEN_DURATION}s`)
		.sign(secret);

	newHeadersObj.append(
		'Set-Cookie',
		`${COOKIE_NAME}=${jwt}; Secure; Max-Age: ${TOKEN_DURATION}; Path=/; `
	);
}

function encodeJwtSecret(jwtSecret) {
	return new TextEncoder().encode(jwtSecret);
}
