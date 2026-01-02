<script lang="ts">
	import { type Props as Map_Props } from '../Map/Map.ts';
	import type { HelperState } from './Helper/Helper.ts';

	import Map from '../Map/Map.svelte';
	import {
		onMapClick,
		onMapMove,
		onMapMoveEnd,
		setupFn,
		setStreets,
		addPin,
		setStateHelper,
	} from './StreetPicker';
	import Helper from './Helper/Helper.svelte';
	import { getContext } from 'svelte';

	let { ...everythingElseProps }: Map_Props = $props();
	let helperState: HelperState = $state('');
	setStreets(getContext('streets'));
	setStateHelper((newHelper: HelperState) => {
		helperState = newHelper;
	});
	let mapEl = $state() as Map;
</script>

<div class="relative">
	<div class="helper">
		<div class="helperText rounded-b-xl bg-gray-800 px-3 py-2 text-center">
			{#if mapEl !== undefined}
				<Helper state={helperState} onLocateClick={mapEl.requestLocation} onBackClick={addPin} />
			{/if}
		</div>
	</div>
	<Map
		setup={setupFn}
		handlers={{
			click: onMapClick,
			move: onMapMove,
			moveend: onMapMoveEnd,
			// locationerror: // TODO: handle error by setting Helper to show a different message
		}}
		bind:this={mapEl}
		{...everythingElseProps}
	/>
</div>

<style>
	.helper {
		position: absolute;
		top: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}
	.helperText {
		z-index: 1000;
		margin: auto;
		max-width: 80vw;
	}
</style>
