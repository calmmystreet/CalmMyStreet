<script lang="ts">
	import type { EventHandler } from 'svelte/elements';

	import { color } from '$lib/constants';
	import { slide } from 'svelte/transition';

	interface Props {
		id: string;
		name: string;
		suggestions: string[];
		value: string;
		email: string;
	}
	let { id, name, suggestions, value = $bindable(''), email }: Props = $props();
	var div: HTMLDivElement;
	var textarea: HTMLTextAreaElement;

	function acceptSuggestion(s: string): EventHandler {
		return (e) => {
			e.preventDefault();
			value = s;
			textarea.focus({ preventScroll: true });
			textarea.setSelectionRange(value.length, value.length);
			setTimeout(() => {
				div.scrollIntoView();
			}, 400);
		};
	}

	function invalid(/*e: Event*/) {
		// TODO: e.preventDefault();
		// add message
	}
</script>

<div class="bg-black border rounded-md grid py-2 px-3 mt-5" bind:this={div}>
	<h2 class="text-xl">Describe the problem</h2>
	<p class="text text-gray-400 px-2">This description will be public on the map!</p>
	{#if !value}
		<div class="slideaway" transition:slide>
			{#each suggestions as s (s)}
				<div class="w-fit text-left block {color[2]} rounded-2xl p-2 m-1">
					<button onclick={acceptSuggestion(s)}>{s}...</button>
				</div>
			{/each}
		</div>
	{/if}
	<textarea
		{id}
		class="rounded w-full h-20 text-black"
		{name}
		placeholder="Explain the problem, in your words. Or start with a suggestion from above"
		maxlength="300"
		oninvalid={invalid}
		bind:this={textarea}
		bind:value
		required={email === ''}
	></textarea>
</div>
