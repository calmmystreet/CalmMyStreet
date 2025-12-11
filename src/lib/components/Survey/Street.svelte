<script lang="ts">
	import type { Props } from './types';

	import YesNoNaw from './Selector/YesNoNaw.svelte';
	import PromptingDescription from './PromptingDescription/PromptingDescription.svelte';
	import { slide } from 'svelte/transition';
	let props: Props = $props();
	let isPattern = $state('') as string;
</script>

<input name="type" type="hidden" value="street" />

<PromptingDescription
	id="description"
	name="description"
	suggestions={[
		`There's cut through traffic from `,
		`Cars speed down ${props.attrs.STNAME_ORD.toLowerCase()} `,
		`It's hard to cross ${props.attrs.STNAME_ORD.toLowerCase()} because `,
		`Cars are parked where it's not safe. They park `,
	]}
/>

<div class="py-5"></div>

<YesNoNaw name="pattern" promptText="Is this a common occurence?" bind:value={isPattern} />
{#if isPattern === 'no'}
	<div
		class="bg-[#EED202] text-black text-xl border rounded-md grid gy-2 px-3 mt-5"
		transition:slide
	>
		<p>
			<span class="text-2xl">&#9888;</span>
			Calm My Street is looking for repeating patterns that could be addressed with infrastructural changes
			to calm traffic on a street or neighorhood.
		</p>
		<p class="pt-2">
			If you are trying to report a single unsafe incident, please report it at <a
				href="https://www.closecall.report/report"
				class="text-blue-600 underline">closecall.report</a
			>
		</p>
	</div>
{/if}

<div class="py-5"></div>

{#snippet liveNearbyPrompt()}
	<p>Is this local traffic?</p>
	<p class="text text-gray-400 px-2">
		Are the vehicles heading to a home or business in this neighorhood?
	</p>
{/snippet}

<YesNoNaw name="livenearby" prompt={liveNearbyPrompt} />
