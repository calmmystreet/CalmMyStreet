<script lang="ts">
	import { type Props as Map_Props } from '../Map/Map.ts';

	import Map from '../Map/Map.svelte';
	import { onMapClick, onMapMove, onMapMoveEnd, setupFn, setStreets } from './StreetPicker';
	import { getContext } from 'svelte';

	let { ...everythingElseProps }: Map_Props = $props();
	setStreets(getContext('streets'));
</script>

<Map
	setup={setupFn}
	handlers={{
		click: onMapClick,
		move: onMapMove,
		moveend: onMapMoveEnd /*, 'locationfound': onLocationFound, 'locationerror': onLocationError*/,
	}}
	{...everythingElseProps}
/>
