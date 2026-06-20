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
	import { color } from '$lib/constants.ts';

	let { ...everythingElseProps }: Map_Props = $props();
	let overlayState : boolean = $state(true);
	let helperState: HelperState = $state('');
	setStreets(getContext('streets'));
	setStateHelper((newHelper: HelperState) => {
		helperState = newHelper;
	});
	let mapEl = $state() as Map;
</script>

<div class="relative">
	{#if overlayState && mapEl !== undefined}
	<div class="overlay">
		<div class="overlay-card flex flex-col bg-gray-900 p-6 rounded-xl text-center shadow-2xl max-w-sm mx-4 border border-gray-700 text-white">
			<button
				class={`text-2xl border rounded-lg ${color[1]} hover:bg-green-950 p-1`}
				onclick={() => {overlayState = false; mapEl.requestLocation(); addPin()}}>Find My Location
			</button>
			<p>or <a class="underline" onclick={() => {overlayState = false; addPin()}}>use the map</a></p>
		</div>
	</div>
	{:else}
	<div class="helper">
		<div class="helperText rounded-b-xl bg-gray-800 px-3 py-2 text-center">
			{#if mapEl !== undefined}
				<Helper state={helperState} onLocateClick={mapEl.requestLocation} onBackClick={addPin} />
			{/if}
		</div>
	</div>
	{/if}
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
	.overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.75);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    }
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
