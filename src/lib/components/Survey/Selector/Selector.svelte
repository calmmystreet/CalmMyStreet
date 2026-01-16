<script lang="ts">
	import { slide } from 'svelte/transition';
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
	{#each Object.keys(fields) as field (field)}
		<label for={name + '_' + fields[field]} class="flex-auto px-3">
			<input
				type="radio"
				id={name + '_' + fields[field]}
				{name}
				value={fields[field]}
				bind:group={value}
			/>
			{field}
		</label>
	{/each}
	{#if !required && value}
		<label class="unselector flex-auto px-3" transition:slide for={name + '_'}>
			<input type="radio" id={name + '_'} {name} value="" class="hidden" bind:group={value} />
			{unselectedLabel || 'x'}
		</label>
	{/if}
</fieldset>
