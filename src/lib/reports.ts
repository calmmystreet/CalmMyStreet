import type { LatLngBounds } from 'leaflet';
import type { GeoJsonObject } from 'geojson';

export async function getUserReports(bounds: LatLngBounds): Promise<GeoJsonObject | undefined> {
	const small = bounds.getSouthWest();
	const large = bounds.getNorthEast();
	return fetch(`/api/map?geometry=[${small.lng},${small.lat},${large.lng},${large.lat}]`).then(
		(resp) => resp.json() as unknown as GeoJsonObject
	);
}
