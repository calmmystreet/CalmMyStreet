import { json } from 'itty-router';
import { rangeToGeoPrefix } from './geohash';

export default async function handler(request, env) {
	// TODO: add support for querying extra fields?
	// TODO: add support for uid query where we tie session into query to find your report for a uid
	const queryParams = request.query;
	const dbSession = env.DB.withSession(request.bookmark);
	const fields = [
		'MAX(updated_at) as updated_at',
		'uid',
		'uiddesc',
		'artclass',
		'artdesc',
		'geo',
		'JSON_GROUP_ARRAY(description) FILTER (WHERE description IS NOT NULL) as descriptions',
		'COUNT(*) as votes',
	];

	let whereClause = '';
	// parse params
	if (queryParams.geometry) {
		// TODO: Disable global query maybe
		const geohashes = rangeToGeoPrefix(queryParams.geometry);
		whereClause = ' AND (' + geohashes.map((hash) => `geohash LIKE '${hash}%'`).join(' OR ') + ')';
	}

	// get data
	const resultObj = await dbSession
		.prepare(
			`
			SELECT ${fields.join(', ')}
			FROM map
			WHERE page <> 0
			${whereClause}
			GROUP BY uid, uiddesc, artclass, artdesc, geo
			HAVING COUNT(description) > 0
			LIMIT 100`
		)
		.run();
	if (!resultObj.success) {
		throw new Error('DB read error');
	}
	let results = resultObj.results;

	// process data
	let resultFeatures = [];
	if (results) {
		resultFeatures = results.map((r) => {
			return {
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: JSON.parse(r.geo),
				},
				properties: {
					uid: r.uid,
					uiddesc: r.uiddesc,
					artclass: r.artclass,
					artdesc: r.artdesc,
					updated_at: r.updated_at,
					descriptions: JSON.parse(r.descriptions), // array of descriptions
					votes: r.votes,
				},
			};
		});
	}

	let geoJSON = {
		type: 'FeatureCollection',
		features: resultFeatures,
	};

	return json(geoJSON, {
		status: 200,
	});
}
