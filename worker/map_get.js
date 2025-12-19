import { json } from 'itty-router';
import { rangeToGeoPrefix } from './geohash';

export default async function handler(request, env) {
	// TODO: add support for querying extra fields?
	// TODO: add support for uid query where we tie session into query to find your report for a uid
	const queryParams = request.query;
	const dbSession = env.DB.withSession(request.bookmark);
	const fields = ['uid', 'uiddesc', 'artclass', 'artdesc', 'geo', 'description'];

	let whereClause = '';
	// parse params
	if (queryParams.geometry) {
		// TODO: Disable global query maybe
		const geohashes = rangeToGeoPrefix(queryParams.geometry);
		whereClause = 'WHERE ' + geohashes.map((hash) => `geohash LIKE '${hash}%'`).join(' OR ');
	}

	// get data
	const resultObj = await dbSession
		.prepare(`SELECT ${fields.join(', ')} FROM map ${whereClause} LIMIT 100`)
		.run();
	if (!resultObj.success) {
		throw new Error('DB read error');
	}
	let results = resultObj.results;

	// process data
	let resultsByUid = {};
	if (results) {
		results.forEach((r) => {
			if (!resultsByUid[r.uid]) {
				resultsByUid[r.uid] = [];
			}
			resultsByUid[r.uid].push(r);
		});
	}

	let outputResults = {};
	Object.keys(resultsByUid).forEach((k) => {
		const b = resultsByUid[k];
		const someGeo = b[0].geo;
		outputResults[someGeo] = b;
	});

	return json(outputResults, {
		status: 200,
	});
}
