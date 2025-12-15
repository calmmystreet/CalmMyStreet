<script lang="ts">
	import YesNoNaw from './Selector/YesNoNaw.svelte';
	import { slide } from 'svelte/transition';

	let reporterlivesnearby = $state() as string;
</script>

<YesNoNaw
	name="reporterlivesnearby"
	promptText="Do you live in the area?"
	bind:value={reporterlivesnearby}
/>
{#if reporterlivesnearby === 'no'}
	{#snippet reporterFrequentsPrompt()}
		<p>Do you know this neighborhood well?</p>
		<p class="text-sm text-gray-400 px-2">Do you come here often? Will you notice improvements?</p>
	{/snippet}
	<div transition:slide>
		<YesNoNaw name="reporterfrequents" prompt={reporterFrequentsPrompt} />
	</div>
{/if}
