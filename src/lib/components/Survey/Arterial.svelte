<script lang="ts">
	import type { Props } from './types';

	import PromptingTextBox from './PromptingTextBox/PromptingTextBox.svelte';
	import YesNoNaw from './Selector/YesNoNaw.svelte';
	let props: Props = $props();
</script>

{props.attrs.STNAME_ORD} is an Arterial
<hr class="my-2" />
<input name="type" type="hidden" value="arterial" />

<p>Do you think this road should be designated as an arterial?<YesNoNaw name="dedesignate" /></p>

<h2 class="text-large">Describe the problem</h2>
<p class="text text-gray-400 px-2">This description will be public on the map!</p>
<PromptingTextBox
	id="description"
	name="description"
	suggestions={[
		`It's challenging to cross ${props.attrs.STNAME_ORD.toLowerCase()} near ${props.attrs.XSTRHI.toLowerCase()} because `,
		`I feel unsafe walking along ${props.attrs.STNAME_ORD.toLowerCase()} between ${props.attrs.XSTRHI.toLowerCase()} and ${props.attrs.XSTRLO.toLowerCase()} because `,
		`I don't think ${props.attrs.STNAME_ORD.toLocaleLowerCase()} should be an arterial because there's a better route on `,
		`Cars drive dangerously fast on ${props.attrs.STNAME_ORD.toLocaleLowerCase()}, the city should `,
		`Sidewalks are needed here `,
	]}
/>
