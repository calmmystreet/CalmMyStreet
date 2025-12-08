import type { Geometry, Position } from 'geojson';
import type { StyleFunction } from 'leaflet';
import { color, type FeatureAttrs } from '$lib/constants';

export function findMidPoint(g: Geometry): Position {
	switch (g.type) {
		case 'Point':
			return g.coordinates;
		case 'LineString':
			return g.coordinates[Math.floor(g.coordinates.length / 2)];
		default:
			throw new Error(`Unsupported shape type: ${g.type}`);
	}
}

export const generateLineStyle: StyleFunction = (f) => {
	const attrs = f?.properties as FeatureAttrs;
	let colorClass = color[1];
	if (attrs && attrs.color) {
		colorClass = attrs.color;
	}
	return {
		color: colorClass.substring(4, 11),
		weight: 10,
		lineCap: 'round',
	};
};
