<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import mapLib, { type Props } from './Map';

	let { setup, handlers, cleanup, inert, ...everythingElseProps }: Props = $props();

	onMount(() => {
		mapLib.inert = inert || false;
		mapLib.onMapMount(setup, handlers);
	});

	onDestroy(() => {
		mapLib.onMapDestroy(cleanup);
	});
</script>

<svelte:head>
	<!-- Leaflet -->
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
	<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
	<!-- Esri Leaflet -->
	<script src="https://unpkg.com/esri-leaflet@3.0.19/dist/esri-leaflet.js"></script>
</svelte:head>

<div id="map" data-testid="map" bind:this={mapLib.mapEl} {...everythingElseProps}></div>
