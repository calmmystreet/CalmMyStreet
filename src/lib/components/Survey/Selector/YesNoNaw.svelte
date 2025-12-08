<script lang="ts">
	import type { PresetProps } from './types';

	import Selector from './Selector.svelte';

	let { ...everythingElseProps }: PresetProps = $props();
</script>

<Selector fields={['yes', 'no']} {...everythingElseProps} />
