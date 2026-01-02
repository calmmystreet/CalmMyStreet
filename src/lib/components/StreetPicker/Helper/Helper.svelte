<script lang="ts">
	import type { HelperState } from './Helper';

	import { color } from '$lib/constants';

	interface Props {
		state: HelperState;
		onLocateClick: () => void;
		onBackClick: () => void;
	}
	let { state, onLocateClick, onBackClick }: Props = $props();
</script>

{#if state === 'locate'}
	<button
		class={`text-2xl border rounded-lg ${color[1]} hover:bg-green-950 p-1`}
		onclick={onLocateClick}>Find My Location</button
	>
{:else if state === 'back'}
	<p class="text-2xl">Which street needs calming?</p>
	or<button class="border rounded-lg bg-blue-900 hover:bg-blue-950 p-1" onclick={onBackClick}
		>Select a different area</button
	>
{/if}
