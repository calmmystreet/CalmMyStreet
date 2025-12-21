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
		whereClause = ' AND ' + geohashes.map((hash) => `geohash LIKE '${hash}%'`).join(' OR ');
	}

	// get data
	const resultObj = await dbSession
		.prepare(
			`
			SELECT ${fields.join(', ')}
			FROM map
			WHERE description IS NOT NULL 
			AND description <> ''
			${whereClause} 
			LIMIT 100`
		)
		.run();
	if (!resultObj.success) {
		throw new Error('DB read error');
	}
	let results = resultObj.results;

	// process data
	// step 1: Group the data into {UID: [{data w/ that uid}]}
	let resultsByUid = {};
	if (results) {
		results.forEach((r) => {
			if (!resultsByUid[r.uid]) {
				resultsByUid[r.uid] = {
					commonAttrs: {
						uid: r.uid,
						uiddesc: r.uiddesc,
						artclass: r.artclass,
						artdesc: r.artdesc,
						geo: r.geo,
					},
					descriptions: [], // added to by the line below
				};
			}
			resultsByUid[r.uid].descriptions.push(r.description);
		});
	}

	let geoJSON = {
		type: 'FeatureCollection',
		features: Object.keys(resultsByUid).map((k) => {
			const b = resultsByUid[k];
			const commonAttrs = b.commonAttrs;
			const descriptions = b.descriptions;
			return {
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: JSON.parse(commonAttrs.geo),
				},
				properties: {
					...commonAttrs,
					descriptions, // array of descriptions
				},
			};
		}),
	};

	return json(geoJSON, {
		status: 200,
	});
}
