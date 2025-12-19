import type { Feature, FeatureCollection } from 'geojson';
import type { Query } from 'esri-leaflet';
import { esriOptions, type FeatureAttrs } from './constants';

// lazy loaded esri
let esriPromise: Promise<typeof import('esri-leaflet')>;
// client side streets cache. Key = objid
const visitedStreets: Map<string, Feature | Promise<Feature>> = new Map();
export async function onMount() {
	if (!esriPromise) {
		// lazy load the leaflet lib
		esriPromise = import('esri-leaflet');
	}
}

export function doSearch(loc: L.LatLng) {
	// unit: meters
	return doPromiseQuery((q) => q.nearby(loc, 30));
}

export async function getFeature(id: string) {
	// try cache first
	if (visitedStreets.has(id)) {
		return visitedStreets.get(id)!;
	}
	const p = doPromiseQuery((q) => q.where("UNITIDSORT = '" + id + "'")).then((geojson) => {
		if (geojson.features.length !== 1) {
			throw new Error(`Feature not found`);
		}
		return geojson.features[0];
	});
	// store the pending promise into the map so that we don't do double lookups
	// if another request for this feature comes in while promise is pending.
	// Since this is an async function returning the promise from the map is
	// basically the same as returning the constant
	visitedStreets.set(id, p);
	return p;
}

async function doPromiseQuery(filterApplicator: (e: Query) => Query) {
	return new Promise<FeatureCollection>((resolve, reject) => {
		if (!esriPromise) {
			reject(
				new Error(
					'Streets information was not initialized yet. Cannot query until onMount is called'
				)
			);
			return;
		}
		esriPromise.then(
			(esri) => {
				const query: Query = esri
					.query({ url: esriOptions.url })
					.where(esriOptions.where)
					.fields(esriOptions.fields);
				filterApplicator(query).run((error: Error, geojson: FeatureCollection) => {
					if (error) {
						reject(error);
						return;
					}
					visitStreets(geojson);
					resolve(geojson);
				});
			},
			(reason) => {
				reject(new Error(`Streets library was no initialized`, { cause: reason }));
			}
		);
	});
}

// parse the response safely and store any objects we find
function visitStreets(geojson: FeatureCollection) {
	try {
		geojson.features.forEach((f: Feature) => {
			const key = (f.properties as FeatureAttrs).UNITIDSORT;
			if (key) {
				visitedStreets.set(key, f);
			}
		});
	} catch (e) {
		console.warn(`Failure in caching streets response`, e);
	}
}
