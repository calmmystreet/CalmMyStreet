<script lang="ts">
	import type { EventHandler } from 'svelte/elements';

	import { color } from '$lib/constants';

	interface Props {
		id: string;
		name: string;
		suggestions: string[];
	}
	let { id, name, suggestions }: Props = $props();
	var value: string = $state('');
	var textarea: HTMLTextAreaElement;

	function acceptSuggestion(s: string): EventHandler {
		return (e) => {
			e.preventDefault();
			value = s;
			textarea.focus();
			textarea.setSelectionRange(value.length, value.length);
		};
	}
</script>

<div>
	{#if !value}
		<div class="slideaway">
			{#each suggestions as s (s)}
				<div class="w-fit text-left block {color[2]} rounded-2xl p-2 m-1">
					<button onclick={acceptSuggestion(s)}>{s}...</button>
				</div>
			{/each}
		</div>
	{/if}
	<textarea {id} class="w-full h-20 text-black" {name} bind:this={textarea} bind:value></textarea>
</div>

<style>
	.slideway {
		height: fit-content;
		transition: height 1s;
	}
	@starting-style {
		.slideaway {
			height: 0;
		}
	}
</style>
