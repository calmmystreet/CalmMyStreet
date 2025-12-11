<script lang="ts">
	import type { Props } from './types';

	import YesNoNaw from './Selector/YesNoNaw.svelte';
	import PromptingDescription from './PromptingDescription/PromptingDescription.svelte';
	let props: Props = $props();
</script>

<p class="my-1">
	This road is designated for through traffic vehicles. We'd still like to hear your thoughts, but
	getting cars off arterials like this can be more challenging.
</p>
<p class="my-1">
	Arterials are a necessity for traffic to get around the city. However, they should not divide the
	neighborhoods, and they still have to be safe for people to cross and navigate.
</p>

<input name="type" type="hidden" value="arterial" />

<!--TODO: add a popup definition for arterial?-->
{#snippet dedesignatePrompt()}
	Do you think this road should continue to be designated as an arterial?
{/snippet}
<YesNoNaw name="dedesignate" prompt={dedesignatePrompt} />

<PromptingDescription
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
