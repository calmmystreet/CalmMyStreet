<script lang="ts">
	import type { Feature, Geometry, Position } from 'geojson';
	import { color, type FeatureAttrs } from '$lib/constants';
	import Street from './Street.svelte';
	import Arterial from './Arterial.svelte';
	import YesNoNaw from './Selector/YesNoNaw.svelte';
	import Selector from './Selector/Selector.svelte';
	import { getContext, onMount } from 'svelte';

	interface Props {
		oid: string;
	}
	let props: Props = $props();
	const oid = props.oid;
	const streets: typeof import('$lib/streets') = getContext('streets');

	let feature = $state() as Feature;
	let midPoint = $state() as Position;
	let featureProps = $state() as FeatureAttrs;
	let page = $state(0) as number;

	let page1Class = $derived(!page || page === 0 ? 'contents' : 'hidden');
	let page2Class = $derived(page === 1 ? 'contents' : 'hidden');
	let page3Class = $derived(page === 2 ? 'contents' : 'hidden');
	onMount(() => {
		streets.onMount(); // make sure streets is loaded
		streets.getFeature(oid).then(
			(f) => {
				feature = f;
				midPoint = findMidPoint(f.geometry);
				featureProps = f.properties as unknown as FeatureAttrs;
			},
			// ignores getFeature errors because SurveyHeader handles it
			// and this component just doesn't render if we failed to find it
			() => {}
		);
	});
	function findMidPoint(g: Geometry): Position {
		switch (g.type) {
			case 'Point':
				return g.coordinates;
			case 'LineString':
				return g.coordinates[Math.floor(g.coordinates.length / 2)];
			default:
				throw new Error(`Unsupported shape type: ${g.type}`);
		}
	}
	function completeForm(e: SubmitEvent) {
		e.preventDefault();
		// TODO: Serialize the form and submit it
		if (page === 0) {
			alert('Form Submitted and would be saved, but your data has been lost');
		}
		page++;
	}
</script>

{#if feature}
	<form method="POST" onsubmit={completeForm}>
		<input name="page" type="hidden" value={page} />
		<fieldset id="page1" class={page1Class}>
			<input name="oid" type="hidden" value={oid} />
			<input name="geo" type="hidden" value={midPoint} />
			{#if featureProps.ARTCLASS == 0}
				<Street position={midPoint} attrs={featureProps} />
			{:else}
				<Arterial position={midPoint} attrs={featureProps} />
			{/if}
			<hr class="my-7" />
			<h1 class="text-xl"><b>Tell me about you!</b></h1>
			Do you live in the area? <YesNoNaw name="reporterlivesnearby" />
			<br />&nbsp;&nbsp;&nbsp;If: no... do you come here often? <YesNoNaw
				name="reporterfrequents"
			/>
			<br /><br />

			<div class="flex flex-col">
				<div>
					<label for="email">Your Email: </label>
					<input id="email" class="text-black" name="email" type="text" autocomplete="email" />
				</div>
				<div>
					<p>
						Can I ask you for more details about your report? <YesNoNaw name="reporterfollowup" />
					</p>
					<p>
						What can I contact you about? <Selector
							name="reportercontact"
							fields={['This neighborhood', 'Citywide', 'Tell me everything']}
							unselectedLabel="Never speak to me"
						/>
					</p>
					<p class="text-xs px-2">
						Keep in mind I have nothing to sell you except a better city to live in
					</p>
				</div>
			</div>
			<br />
			<input
				class="block w-full {color[1]} rounded"
				type="submit"
				value="Publish to Map (and continue)"
			/>
		</fieldset>
		<fieldset id="page2" class={page2Class}>
			<p>
				Thank you for submitting. To better understand solutions in this area, I'd appreciate a
				little bit more information. This data will not be published publicly
			</p>
			{#if featureProps.ARTCLASS == 0}
				<label for="badusageroute">Where are drivers typically coming from and heading to?</label>
				<textarea id="badusageroute" class="w-full h-15 text-black" name="badusageroute"></textarea>
			{/if}
			<label for="solution">How do you think we can prevent this?</label>
			<textarea id="solution" class="w-full h-15 text-black" name="solution"></textarea>
			<input
				class="block w-full {color[1]} rounded"
				type="submit"
				value="Save additional information"
			/>
		</fieldset>
		<div id="page3" class={page3Class}>
			<p>Thank you for the extra info. Care to share with your friend?</p>
			<p>Please report more issues as you find them.</p>
		</div>
	</form>
{/if}
