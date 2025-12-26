import { type Props as Map_Props } from '../Map/Map.ts';
import type { LayerGroup, Marker, Map, StyleFunction } from 'leaflet';
import type { Point, FeatureCollection, LineString } from 'geojson';

import { color, maxZoom, type FeatureAttrs } from '$lib/constants';
import { getUserReports } from '$lib/reports';

const initialText = 'Drag or tap to start a report';
let L: typeof import('leaflet');
let map: Map;
let streets: typeof import('$lib/streets');
let streetsLayerGroup: LayerGroup;
let reportsLayerGroup: LayerGroup;
let centerMarker: Marker | undefined;
let colorPos = 1;
let postMovePreLoadTimer: NodeJS.Timeout | undefined;

interface UserReportProperties {
	uid: string;
	uiddesc: string;
	artclass: string;
	artdesc: string;
	geo: string;
	descriptions: [string];
}

export const setStreets = (streetClass: typeof import('$lib/streets')) => {
	streets = streetClass;
};

// runs after the initial map basics are setup and stands up the default state of the picker
export const setupFn: Map_Props['setup'] = (leaflet, newMap) => {
	L = leaflet;
	map = newMap;

	streetsLayerGroup = L.layerGroup().addTo(map);
	reportsLayerGroup = L.layerGroup().addTo(map);

	centerMarker = L.marker(map.getCenter(), {
		riseOnHover: true,
		draggable: true,
		icon: L.icon({
			iconUrl: '/marker-icon.png',
			iconRetinaUrl: '/marker-icon-2x.png',
			shadowUrl: '/marker-shadow.png',
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			tooltipAnchor: [16, -28],
			shadowSize: [41, 41],
		}),
	})
		.addTo(map)
		.bindPopup(initialText)
		.openPopup();
	centerMarker.on('dragend', onCenterMarkerDrag);
};

function zoomAndMoveTo(loc: L.LatLng) {
	throwIfNoMap();
	if (!centerMarker) {
		return;
	}
	// try to zoom in one more level if its not already at max zoom
	const zoom = Math.min(map.getZoom() + 1, maxZoom);
	map.flyTo(loc, zoom);
}

export const onMapClick: L.LeafletMouseEventHandlerFn = (e) => zoomAndMoveTo(e.latlng);

export const onCenterMarkerDrag: L.LeafletEventHandlerFn = (e) =>
	zoomAndMoveTo(e.target.getLatLng());

export const onMapMove: L.LeafletEventHandlerFn = () => {
	throwIfNoMap();
	if (centerMarker) {
		centerMarker.closePopup(); // this must happen before setLatLng or else it loops on small screens
		centerMarker.setLatLng(map.getCenter());
	}
	if (postMovePreLoadTimer) {
		clearTimeout(postMovePreLoadTimer);
		postMovePreLoadTimer = undefined;
	}
};

export const onMapMoveEnd: L.LeafletEventHandlerFn = () => {
	throwIfNoMap();
	if (centerMarker && !centerMarker.isPopupOpen()) {
		centerMarker
			.bindPopup(createButton(`Report issue here`, showStreets), {
				closeOnClick: false,
				closeOnEscapeKey: false,
				closeButton: false,
			})
			.openPopup();
	}
	postMovePreLoadTimer = setTimeout(maybeLoadReports, 1000);
};

async function maybeLoadReports() {
	if (map.getZoom() < 15) {
		return; // skip when zoomed out
	}
	const newReports = await getUserReports(map.getBounds());
	if (!newReports) {
		return;
	}
	// TODO: Filter existing reports
	const newPoints = L.geoJSON<Point>(newReports, {
		bubblingMouseEvents: false,
		style: {
			fill: true,
			fillColor: color[3].substring(4, 11),
			color: color[3].substring(4, 11),
			fillOpacity: 100,
		},
		onEachFeature: (f, l) => {
			const userReport = f.properties as unknown as UserReportProperties;
			l.bindPopup(
				userReport.descriptions.join('<br>') +
					`<br><a href="/report/?uid=${userReport.uid}">Report another issue here</a>`,
				{
					maxHeight: 500,
					maxWidth: window.screen.width * 0.8,
					autoPan: false,
				}
			);
		},
		pointToLayer: (_geoJsonPoint, latlng) => L.circle(latlng, { radius: 15 }),
	});
	reportsLayerGroup.addLayer(newPoints);
}

// onclick event for the `Report issue here` button
function showStreets(e: PointerEvent) {
	throwIfNoMap();
	if (!centerMarker) {
		console.warn(`duplicate button presses called showStreets`);
		return;
	}
	e.stopPropagation();
	// TODO: fix the loading icon
	const button = e.target as HTMLButtonElement;
	const buttonInners = document.createElement('span');
	buttonInners.className = 'loader';
	button.replaceChildren(buttonInners);
	button.disabled = true;

	const latlng = centerMarker.getLatLng();
	const searchPromise = streets.doSearch(latlng);
	// handle happy path
	searchPromise
		.then((featureCollection: FeatureCollection) => {
			// send empty results to a quiet error path
			if (featureCollection.features.length === 0) {
				showPinError(`No Seattle streets found here.`);
				throw new Error(); // short circuit the chain
			}
			return featureCollection;
		})
		.then(confirmStreets, () => {});
	// handle failed call to searchForStreets
	searchPromise.catch((err) => showPinError(`Error fetching streets. ${err.message}.`));
}

// called once the request for street metadata comes back with data
function confirmStreets(featureCollection: FeatureCollection) {
	throwIfNoMap();
	if (!streetsLayerGroup) {
		console.error(`failed to show streets due to missing layerGroup`);
		return;
	}
	centerMarker?.remove();
	centerMarker = undefined;

	// create the buttons and lines and put em on the map then fly to them
	streetsLayerGroup?.clearLayers();
	const layer = L.geoJSON<LineString>(featureCollection, {
		bubblingMouseEvents: false,
		style: generateLineStyle,
		onEachFeature: (f, l) => {
			const attrs = f.properties as unknown as FeatureAttrs;
			l.bindPopup(createButton(attrs.STNAME_ORD, '/report/?uid=' + attrs.UNITIDSORT, attrs.color), {
				autoClose: false,
			});
		},
	});
	map.flyToBounds(layer.getBounds());
	streetsLayerGroup.addLayer(layer);
	layer.eachLayer((l) => {
		l.openPopup();
	});
}

function showPinError(message: string) {
	throwIfNoMap();
	if (!centerMarker) {
		console.error(`failed to show error message on centerPin: ${message}`);
		return;
	}
	centerMarker.bindPopup(`${message}<br> ${initialText}`).openPopup();
}

const generateLineStyle: StyleFunction = (f) => {
	const nextColor = color[colorPos++ % color.length];
	f!.properties.color = nextColor;
	return {
		color: nextColor.substring(4, 11),
		weight: 15,
		lineCap: 'round',
	};
};

function createButton(
	text: string,
	onclick: ((e: PointerEvent) => void) | string,
	col?: string
): HTMLElement {
	let button;
	if (typeof onclick === 'string') {
		button = document.createElement('a');
		button.href = onclick;
		button.style.color = 'white';
	} else {
		button = document.createElement('button');
		button.onclick = onclick;
	}
	button.textContent = text;
	button.className = `w-full ${col || color[0]} hover:bg-gray-800 py-2 px-4 rounded`;
	return button;
}

function throwIfNoMap() {
	if (!L || !map) {
		throw new Error(`Can't pick streets because Leaflet Map is not setup`);
	}
}
