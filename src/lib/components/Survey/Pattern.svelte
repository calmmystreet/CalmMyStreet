<script lang="ts">
	import YesNoNaw from './Selector/YesNoNaw.svelte';
	import { slide } from 'svelte/transition';

	let isPattern = $state('') as string;
</script>

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
