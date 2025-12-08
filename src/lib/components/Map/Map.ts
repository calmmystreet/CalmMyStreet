import type { HTMLAttributes } from 'svelte/elements';
import type { LeafletEventHandlerFnMap, Map } from 'leaflet';

import { center, tileLayer, tileLayerAttribution, maxZoom } from '$lib/constants';

export interface Props extends HTMLAttributes<HTMLDivElement> {
	setup?: (leaflet: typeof import('leaflet'), map: Map) => void;
	handlers?: LeafletEventHandlerFnMap;
	cleanup?: () => void;
	interactive?: boolean;
}

export default new (class mapLib {
	mapEl!: HTMLDivElement;
	leaflet: typeof import('leaflet') | undefined;
	map: L.Map | undefined;
	inert: boolean | undefined;
	onMapMount = async (setup: Props['setup'], handlers: Props['handlers']) => {
		this.leaflet = window.L;
		if (this.leaflet === undefined) {
			console.log('Failed to initialize map');
			return;
		}
		this.map = this.leaflet
			.map(this.mapEl, {
				zoomControl: !this.inert,
				attributionControl: !this.inert,
				closePopupOnClick: !this.inert,
				doubleClickZoom: !this.inert,
				boxZoom: !this.inert,
				dragging: !this.inert,
				keyboard: !this.inert,
				scrollWheelZoom: !this.inert,
				touchZoom: !this.inert,
			})
			.setView(center, 11);
		this.leaflet
			.tileLayer(tileLayer, {
				maxZoom,
				attribution: tileLayerAttribution,
			})
			.addTo(this.map);

		if (setup) {
			setup(this.leaflet, this.map);
		}
		if (handlers) {
			this.map.on(handlers);
		}
	};

	onMapDestroy = (cleanup: Props['cleanup']) => {
		if (this.map) {
			if (cleanup) {
				cleanup();
			}
			this.map.remove();
			this.map = undefined;
		}
	};

	onLocationFound = (e: L.LocationEvent) => {
		if (this.map) {
			this.map.flyToBounds(e.bounds);
		}
	};

	onLocationError = (e: L.ErrorEvent) => {
		// TODO: add error message to top of screen
		alert(e.message);
	};

	onRequestLocation = () => {
		if (this.map) {
			this.map.locate();
		}
	};
})();
