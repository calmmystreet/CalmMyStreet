<script lang="ts">
	import type { Map, GeoJSON, StyleFunction } from 'leaflet';
	import type { Feature, Geometry, LineString } from 'geojson';
	import { type Props as Map_Props } from '../Map/Map.ts';
	import { color, type FeatureAttrs } from '$lib/constants';
	import MapComponent from '../Map/Map.svelte';
	import { getContext, onMount } from 'svelte';

	interface Props {
		oid: string;
	}
	interface State {
		feature: Feature;
		featureProps: FeatureAttrs;
		featureError: Error;
	}
	let props: Props = $props();
	const oid = props.oid;
	const streets: typeof import('$lib/streets') = getContext('streets');
	let { feature, featureProps, featureError } = $state({}) as State;
	let map: Map;
	let mapLayer: GeoJSON<LineString, Geometry>;
	onMount(() => {
		streets.onMount(); // make sure streets is loaded
		streets
			.getFeature(oid)
			.then((f) => {
				feature = f;
				featureProps = feature.properties as unknown as FeatureAttrs;
			})
			.then(tryAddMapLayer)
			.catch((e) => {
				console.log(`Caught error fetching feature`, e);
				featureError = e as Error;
			});
	});
	const mapSetupFn: Map_Props['setup'] = (leaflet, newMap) => {
		map = newMap;
		mapLayer = leaflet
			.geoJSON<LineString>(null, {
				interactive: false,
				style: generateLineStyle,
			})
			.addTo(map);
		tryAddMapLayer();
	};

	// we have to wait until both mapSetupFn is triggered and for the feature to be fetched by onMount
	// in order to run this method which adds the feature to the map and zooms to it
	function tryAddMapLayer() {
		if (mapLayer && feature && featureProps) {
			mapLayer.addData(feature);
			map.flyToBounds(mapLayer.getBounds().pad(4));
		}
	}

	const generateLineStyle: StyleFunction = (f) => {
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
</script>

<article class="max-w-prose prose-base lg:prose-xl text-white text-center">
	{#if !featureError && !feature}
		<h1>Loading...</h1>
	{:else if feature}
		<h1>Tell me about {featureProps.STNAME_ORD}</h1>
	{:else}
		<h1>
			<span class="text-red-500">Error</span>: {featureError.message || 'Failed to find street'}
		</h1>
	{/if}
</article>
<MapComponent inert setup={mapSetupFn} class="h-60"></MapComponent>
