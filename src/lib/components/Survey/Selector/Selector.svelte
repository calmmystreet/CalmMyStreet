<script lang="ts">
	import type { Props } from './types';

	let {
		name,
		prompt,
		promptText,
		fields,
		unselectedLabel,
		value = $bindable(),
		required,
	}: Props = $props();
</script>

<fieldset {name} class="bg-black border rounded-md grid p-1 px-3">
	<div class="text-xl">
		{#if promptText}
			{promptText}
		{/if}
		{#if prompt}
			{@render prompt?.()}
		{/if}
	</div>
	{#each fields as field (field)}
		<label for={name + '_' + field} class="flex-auto px-3">
			<input type="radio" id={name + '_' + field} {name} value={field} bind:group={value} />
			{field}
		</label>
	{/each}
	{#if !required}
		<label class="unselector flex-auto px-3" for={name + '_'}>
			<input type="radio" id={name + '_'} {name} value="" class="hidden" bind:group={value} />
			{unselectedLabel || 'x'}
		</label>
	{/if}
</fieldset>
