import * as jose from 'jose';

const COOKIE_NAME = 'calmmystreet_session';
const TOKEN_DURATION = '2419200'; // 4weeks in seconds
const ALGORITHM = 'HS256';

export default async function withSession(request, env) {
	const jwtSecret = env.JWT_SECRET;

	const cookies = request.cookies;
	const sessionToken = cookies[COOKIE_NAME];

	const decoded = await tryDecodeSessionToken(sessionToken, jwtSecret);
	if (decoded === undefined) {
		request.session = await generateSession();
	} else {
		request.session = decoded.session;
		request.bookmark = decoded.bookmark;
	}
	request.genCookie = (b) => genCookie(b, request.session, jwtSecret);
}

async function tryDecodeSessionToken(jwt, jwtSecret) {
	if (!jwt) {
		return undefined; // no token to parse
	}
	const secret = encodeJwtSecret(jwtSecret);
	const { payload } = await jose.jwtVerify(jwt, secret, {
		algorithms: [ALGORITHM],
	});
	let { sub, bookmark } = payload;
	return {
		session: sub,
		bookmark,
	};
}

// create session
async function generateSession() {
	return crypto.randomUUID();
}

async function genCookie(bookmark, session, jwtSecret) {
	// sign session
	const secret = encodeJwtSecret(jwtSecret);

	const jwt = await new jose.SignJWT({ bookmark: bookmark })
		.setProtectedHeader({ alg: ALGORITHM })
		.setIssuedAt()
		.setSubject(session)
		.setExpirationTime(`${TOKEN_DURATION}s`)
		// TODO: Set Expires to something b/c otherwise it's a session token
		.sign(secret);

	const headers = new Headers();
	headers.append(
		'Set-Cookie',
		`${COOKIE_NAME}=${jwt}; Secure; Max-Age: ${TOKEN_DURATION}; Path=/; `
	);
	return headers;
}

function encodeJwtSecret(jwtSecret) {
	return new TextEncoder().encode(jwtSecret);
}
