import type { Geometry, Position } from 'geojson';
import type { StyleFunction } from 'leaflet';
import { color, type FeatureAttrs } from '$lib/constants';

// TODO: do this properly
export function findMidPoint(g: Geometry): Position {
	switch (g.type) {
		case 'Point':
			return g.coordinates;
		case 'LineString':
			if (g.coordinates.length % 2 === 0) {
				// for even numbers, average them
				const lowIndex = Math.floor(g.coordinates.length / 2);
				const highIndex = lowIndex - 1;
				const lowPosition = g.coordinates[lowIndex];
				const highPosition = g.coordinates[highIndex];
				return [(lowPosition[0] + highPosition[0]) / 2, (lowPosition[1] + highPosition[1]) / 2];
			}
			return g.coordinates[Math.floor(g.coordinates.length / 2)];
		default:
			throw new Error(`Unsupported shape type: ${g.type}`);
	}
}

export const generateLineStyle: StyleFunction = (f) => {
	if (f?.geometry.type === 'Point') {
		return {
			fill: true,
			fillColor: color[3].substring(4, 11),
			color: color[3].substring(4, 11),
			fillOpacity: 100,
			interactive: false,
		};
	}
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

export function share() {
	navigator.share({ url: window.location.origin, title: 'Calm My Street' });
}
