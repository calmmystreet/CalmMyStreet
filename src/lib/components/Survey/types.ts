import type { FeatureAttrs } from '$lib/constants';
import type { Position } from 'geojson';

export interface Props {
	position: Position;
	attrs: FeatureAttrs;
}
