<script lang="ts">
	import type { PresetProps } from './types';

	import Selector from './Selector.svelte';

	let { value = $bindable(), ...everythingElseProps }: PresetProps = $props();
</script>

<Selector fields={{ yes: 'yes', no: 'no' }} bind:value {...everythingElseProps} />
