import { json } from 'itty-router';
import { pointToGeoHash } from './geohash';

// does not include special db rows:
//   session (from cookies),
//   geohash (generated from geo),
const NORMAL_BODY_FIELDS = {
	page: validate_integer,
	uid: validate_string,
	uiddesc: validate_string,
	artclass: validate_integer,
	artdesc: validate_string,
	geo: validate_string,
	district: validate_string,
	dedesignate: validate_yn,
	description: validate_long_string,
	pattern: validate_yn,
	localtraffic: validate_yn,
	reporterlivesnearby: validate_yn,
	reporterfrequents: validate_yn,
	email: validate_string, // stored differently after validation
	reportercontact: validate_string,
	badusageroute: validate_long_string,
	solution: validate_long_string,
};

export default async function handler(request, env) {
	const body = request.content;
	const session = request.session;
	const bookmark = request.bookmark;

	const dbSession = env.DB.withSession(bookmark);
	// email is separated from the payload to prevent it from going into the result
	const { email, ...payload } = normalizeBody(body);
	const geohash = pointToGeoHash(payload.geo);

	const queries = [generateQuery(dbSession, session, geohash, payload)];
	const cookiePayload = {};
	if (email !== undefined && email !== null) {
		queries.push(
			dbSession
				.prepare(
					`INSERT INTO 
			email (session, uid, email) 
			VALUES (?, ?, ?)`
				)
				.bind(session, payload.uid, email)
		);
		cookiePayload.email = email;
	} else if (request.email !== undefined) {
		cookiePayload.email = request.email; // preserve the email in the cookie if not passed this time
	}
	const batchResult = await dbSession.batch(queries);
	// generate the response!!
	const headers = await request.genCookie({ bookmark: dbSession.getBookmark(), ...cookiePayload });
	return json(batchResult, {
		status: 200,
		headers,
	});
}

function normalizeBody(requestBody) {
	let outputBody = {};
	Object.keys(requestBody).forEach((k) => {
		const validatorFunc = NORMAL_BODY_FIELDS[k];
		if (!validatorFunc) {
			throw new Error(`Tried to write unknown field ${k}`);
		}
		const validatorResp = validatorFunc(k, requestBody[k]);
		if (validatorResp !== undefined) {
			outputBody[k] = validatorResp;
		}
	});
	// special check for uid - must be non-null
	if (!outputBody.uid) {
		throw new Error(`Mandatory field missing: uid`);
	}
	// special check for geo - must be non-null
	if (!outputBody.geo) {
		throw new Error(`Mandatory field missing: geo`);
	}
	return outputBody;
}

function generateQuery(db, session, geohash, payload) {
	let keys = [];
	let questions = [];
	let values = [];
	Object.keys(payload).forEach((k) => {
		keys.push(k);
		questions.push('?');
		values.push(payload[k]);
	});
	return db
		.prepare(
			`INSERT INTO 
		map (session, geohash, ${keys.join(', ')})
		VALUES (?, ?, ${questions.join(', ')})`
		)
		.bind(session, geohash, ...values);
}

function validate_integer(k, s) {
	const asNum = parseInt(s, 10);
	if (Number.isNaN(asNum) || asNum.toString() !== s) {
		throw new Error(`Failed to parse field ${k} as integer`);
	}
	return asNum;
}

function validate_string(k, s) {
	return validate_string_length(k, s, 256);
}

function validate_long_string(k, s) {
	return validate_string_length(k, s, 5000);
}

function validate_string_length(k, s, len) {
	if (typeof s !== 'string') {
		throw new Error(`Failed to parse field ${k} as string`);
	}
	s = s.trim();
	if (s.length > len) {
		throw new Error(`Failed to parse field ${k} as string. Length too long`);
	}
	if (s.length === 0) {
		return undefined;
	}
	return s;
}

function validate_yn(k, s) {
	const asStr = validate_string_length(k, s, 3);
	if (!asStr) {
		return undefined;
	}
	if (asStr === 'yes') {
		return true;
	}
	if (asStr === 'no') {
		return false;
	}
	throw new Error(`Failed to parse field ${k} as yes/no string`);
}
