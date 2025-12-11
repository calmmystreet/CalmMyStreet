<script lang="ts">
	import type { Feature, Position, LineString } from 'geojson';
	import { type Props as Map_Props } from '../Map/Map.ts';
	import { color, type FeatureAttrs } from '$lib/constants';

	import MapComponent from '../Map/Map.svelte';
	import Street from './Street.svelte';
	import Arterial from './Arterial.svelte';
	import YesNoNaw from './Selector/YesNoNaw.svelte';
	import Selector from './Selector/Selector.svelte';
	import { getContext } from 'svelte';
	import { findMidPoint, generateLineStyle } from './Survey.ts';
	import { slide } from 'svelte/transition';

	interface Props {
		oid: string;
	}
	let props: Props = $props();
	const oid = props.oid;
	const streets: typeof import('$lib/streets') = getContext('streets');

	let feature = $state() as Feature;
	let midPoint = $state() as Position;
	let featureProps = $state() as FeatureAttrs;
	let featureError = $state() as Error;
	let page = $state(0) as number;
	let reporterlivesnearby = $state() as string;

	let page1Class = $derived(!page || page === 0 ? 'contents' : 'hidden');
	let page2Class = $derived(page === 1 ? 'contents' : 'hidden');
	let page3Class = $derived(page === 2 ? 'contents' : 'hidden');
	const mapSetupFn: Map_Props['setup'] = (leaflet, map) => {
		const mapLayer = leaflet
			.geoJSON<LineString>(null, {
				interactive: false,
				style: generateLineStyle,
			})
			.addTo(map);
		streets.getFeature(oid).then(
			(f) => {
				feature = f;
				midPoint = findMidPoint(f.geometry);
				featureProps = f.properties as unknown as FeatureAttrs;
				mapLayer.addData(feature);
				map.flyToBounds(mapLayer.getBounds().pad(4));
			},
			// ignores getFeature errors because SurveyHeader handles it
			// and this component just doesn't render if we failed to find it
			(e) => {
				console.log(`Caught error fetching feature`, e);
				featureError = e as Error;
			}
		);
	};
	function completeForm(e: SubmitEvent) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		formData.entries().forEach((v) => {
			console.log(v);
		});
		if (page === 0) {
			alert('Form Submitted and would be saved, but your data has been lost');
		}
		page++;
	}
</script>

<article class="max-w-prose prose-base lg:prose-xl text-white text-center">
	{#if !featureError && !feature}
		<h1>Loading...</h1>
	{:else if feature}
		<h1>Tell me about {featureProps.STNAME_ORD}</h1>
	{:else}
		<h1>
			<span class="text-red-500">Error</span>: {featureError.message || 'Failed to find street'}
		</h1>
	{/if}
</article>
<MapComponent inert setup={mapSetupFn} class="h-60"></MapComponent>
<a href="/" class="block w-full text-center {color[3]} py-2 rounded-b"
	>&larr; Pick a different street</a
>
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
			<h1 class="text-2xl"><b>Tell me about you!</b></h1>
			<YesNoNaw
				name="reporterlivesnearby"
				promptText="Do you live in the area?"
				bind:value={reporterlivesnearby}
			/>
			{#if reporterlivesnearby === 'no'}
				{#snippet reporterFrequentsPrompt()}
					<p>Do you know this neighborhood well?</p>
					<p class="text text-gray-400 px-2">
						Do you come here often? Will you notice improvements?
					</p>
				{/snippet}
				<div transition:slide>
					<YesNoNaw name="reporterfrequents" prompt={reporterFrequentsPrompt} />
				</div>
			{/if}

			<div class="my-5"></div>

			{#snippet emailOptions()}
				<label for="email" class="block">Email</label>
				<input
					id="email"
					class="text-black w-full max-w-xl"
					name="email"
					type="text"
					autocomplete="email"
					placeholder="funkyname@somedomain.com"
				/>
				<p class="pt-5">What can I contact you about?</p>
				<p class="text text-gray-400 px-2">
					<!-- A note could go here but Idk what to say -->
				</p>
			{/snippet}
			<Selector
				prompt={emailOptions}
				name="reportercontact"
				fields={['Tell me everything', 'Citywide', 'This neighborhood']}
				unselectedLabel="Never speak to me"
			/>
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
			<label for="solution">How do you think we could change this?</label>
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
