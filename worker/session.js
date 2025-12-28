import * as jose from 'jose';
import { COOKIE_NAME } from '../src/lib/constants';

const ALGORITHM = 'HS256';

export default async function withSession(request, env) {
	const jwtSecret = env.JWT_SECRET;

	const cookies = request.cookies;
	const sessionToken = cookies[COOKIE_NAME];

	const decoded = await tryDecodeSessionToken(sessionToken, jwtSecret);
	if (decoded === undefined) {
		request.session = await generateSession();
	} else {
		Object.assign(request, decoded);
	}
	request.genCookie = (payload) => genCookie(payload, request.session, jwtSecret);
}

async function tryDecodeSessionToken(jwt, jwtSecret) {
	if (!jwt) {
		return undefined; // no token to parse
	}
	const secret = encodeJwtSecret(jwtSecret);
	const { payload } = await jose.jwtVerify(jwt, secret, {
		algorithms: [ALGORITHM],
	});
	let { sub, bookmark, email } = payload;
	return {
		// the returns here get added to the request object for future use
		session: sub,
		bookmark,
		email,
	};
}

// create session
async function generateSession() {
	return crypto.randomUUID();
}

// get the date cookies and sessions should expire
function getExpiryDate() {
	const date = new Date();
	date.setUTCDate(date.getUTCDate() + 28);
	return date;
}

async function genCookie(payload, session, jwtSecret) {
	// sign session
	const secret = encodeJwtSecret(jwtSecret);
	const expiryDate = getExpiryDate();

	const jwt = await new jose.SignJWT({ ...payload })
		.setProtectedHeader({ alg: ALGORITHM })
		.setIssuedAt()
		.setSubject(session)
		.setExpirationTime(expiryDate)
		.sign(secret);

	const headers = new Headers();
	headers.append(
		'Set-Cookie',
		`${COOKIE_NAME}=${jwt}; Secure; Expires: ${expiryDate.toUTCString()}; Path=/;`
	);
	return headers;
}

function encodeJwtSecret(jwtSecret) {
	return new TextEncoder().encode(jwtSecret);
}
