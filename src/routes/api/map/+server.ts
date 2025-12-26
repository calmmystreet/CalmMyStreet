import { json } from '@sveltejs/kit';

// TEST DATA FOR DEV MODE ONLY!!!

export function GET() {
	return json({
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [-122.3357108480335, 47.70413101555995],
				},
				properties: {
					uid: '103001030',
					uiddesc: 'WALLINGFORD AVE N BETWEEN N 103RD ST AND N 105TH ST',
					artclass: 0,
					artdesc: 'Not Designated',
					geo: '[-122.3357108480335,47.70413101555995]',
					descriptions: ['Cars speed down wallingford ave n including police cruisers.'],
				},
			},
			{
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [-122.32308835437101, 47.61868326697595],
				},
				properties: {
					uid: '109650070',
					uiddesc: 'E DENNY WAY BETWEEN BOYLSTON AVE AND HARVARD AVE',
					artclass: 2,
					artdesc: 'Minor Arterial',
					geo: '[-122.32308835437101,47.61868326697595]',
					descriptions: ['Too many cars take this route and they go too fast'],
				},
			},
			{
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [-122.322550973971, 47.621996771020704],
				},
				properties: {
					uid: '110900070',
					uiddesc: 'E HARRISON ST BETWEEN BOYLSTON AVE E AND HARVARD AVE E',
					artclass: 0,
					artdesc: 'Not Designated',
					geo: '[-122.322550973971,47.621996771020704]',
					descriptions: [
						'Cars speed down e harrison st cutting from Summit up to Broadway and sometimes across',
					],
				},
			},
			{
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [-122.33841118821849, 47.705042430272044],
				},
				properties: {
					uid: '117400160',
					uiddesc: 'N 105TH ST BETWEEN N NORTHGATE E WAY AND DENSMORE AVE N',
					artclass: 0,
					artdesc: 'Not Designated',
					geo: '[-122.33841118821849,47.705042430272044]',
					descriptions: [
						"There's cut through traffic from Northgate Way to I5. Cars speed down this road to avoid the arterial route.",
					],
				},
			},
			{
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [-122.33799914072651, 47.65916170367525],
				},
				properties: {
					uid: '121050160',
					uiddesc: 'N 43RD ST BETWEEN WOODLAWN AVE N AND DENSMORE AVE N',
					artclass: 0,
					artdesc: 'Not Designated',
					geo: '[-122.33799914072651,47.65916170367525]',
					descriptions: ['Cars need to slow down when children are present'],
				},
			},
			{
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [-122.35116708161, 47.58716275269995],
				},
				properties: {
					uid: '179700110',
					uiddesc: 'SW MASSACHUSETTS ST BETWEEN DEAD END AND 13TH AVE SW',
					artclass: 0,
					artdesc: 'Not Designated',
					geo: '[-122.35116708161,47.58716275269995]',
					descriptions: ["once i've selected a street i cannot deselect it"],
				},
			},
		],
	});
}
