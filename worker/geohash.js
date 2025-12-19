import * as geohash from 'ngeohash';

export function pointToGeoHash(point) {
	point = removeBrackets(point, 'Geo required');
	const coords = point.split(',');
	if (coords.length !== 2) {
		throw new Error('Geo could not find two dimensions');
	}
	const [long, lat] = coords.map((s) => Number(s));
	if (long === 0 || lat === 0) {
		throw new Error("Geo numbers couldn't be parsed");
	}
	return geohash.encode(lat, long);
}

export function rangeToGeoPrefix(geometry) {
	geometry = removeBrackets(geometry, 'geometry query param required');
	const coords = geometry.split(',');
	if (coords.length !== 4) {
		throw new Error('geometry query param could not find 4 dimensions (2 long/lat pairs)');
	}
	const [long1, lat1, long2, lat2] = coords.map((s) => Number(s));
	if (long1 === 0 || lat1 === 0 || long2 === 0 || lat2 === 0) {
		throw new Error("geometry query param numbers couldn't be parsed");
	}
	const [longS, longL] = ensureOrder(long1, long2);
	const [latS, latL] = ensureOrder(lat1, lat2);

	let hashes; // TODO: heuristic instead of brute force here
	for (var precision = 7; precision >= 5; precision--) {
		let phash = geohash.bboxes(latS, longS, latL, longL, precision);
		if (phash.length <= 100) {
			hashes = phash;
			break;
		}
	}
	if (!hashes) {
		throw new Error('geometry covers an area that is too large');
	}
	return hashes;
}

function removeBrackets(inputStr, missingMsg) {
	if (!inputStr) {
		throw new Error(missingMsg);
	}
	if (inputStr.startsWith('[') && inputStr.endsWith(']')) {
		return inputStr.substring(1, inputStr.length - 1);
	}
	return inputStr;
}

function ensureOrder(num1, num2) {
	if (num1 > num2) {
		return [num2, num1];
	}
	return [num1, num2];
}
