<script lang="ts">
	import Selector from './Selector/Selector.svelte';

	interface Props {
		value: string;
		description: string;
	}

	let { value = $bindable(''), description }: Props = $props();

	let emailOptionsValue = $state('Tell me everything') as string;

	function invalid(/*e: Event*/) {
		// TODO: e.preventDefault();
		// add message
	}
</script>

{#snippet emailOptions()}
	<label for="email" class="block">Email</label>
	<input
		id="email"
		class="max-w-xl text-black w-full"
		name="email"
		type="email"
		autocomplete="email"
		placeholder="funkyname@somedomain.com"
		oninvalid={invalid}
		bind:value
		required={description === ''}
	/>
	<p class="pt-5">What can I contact you about?</p>
	<p class="text-sm text-gray-400 px-2">
		I have nothing to sell you, and just want to make Seattle safer.
	</p>
{/snippet}
<Selector
	prompt={emailOptions}
	name="reportercontact"
	fields={{
		'Tell me everything': 'everything',
		'Update me about calmer streets citywide': 'citywide',
		'I want to hear about calmer streets in this neighborhood': 'neighborhood',
		'Never speak to me again': 'never',
	}}
	bind:value={emailOptionsValue}
	required
/>
