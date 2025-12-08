<script lang="ts">
	import type { Props } from './types';

	import PromptingTextBox from './PromptingTextBox/PromptingTextBox.svelte';
	import YesNoNaw from './Selector/YesNoNaw.svelte';
	let props: Props = $props();
</script>

<input name="type" type="hidden" value="street" />

<h2 class="text-l">Describe the problem</h2>
<p class="text-xs text-gray-400 px-2">This description will be public on the map!</p>
<PromptingTextBox
	id="description"
	name="description"
	suggestions={[
		`There's cut through traffic from `,
		`Cars speed down ${props.attrs.STNAME_ORD.toLowerCase()} `,
	]}
/>
<p>Is it a pattern? <YesNoNaw name="pattern" /></p>
<p>Does the driver appear to live nearby? <YesNoNaw name="livenearby" /></p>
