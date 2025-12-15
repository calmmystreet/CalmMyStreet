<script lang="ts">
	import type { GeoJSON, Map } from 'leaflet';
	import type { Feature, Position, LineString, Geometry, Point } from 'geojson';
	import { type Props as Map_Props } from '../Map/Map.ts';
	import { color, type FeatureAttrs } from '$lib/constants';
	import { findMidPoint, generateLineStyle, share } from './Survey.ts';
	import LivesNearby from './LivesNearby.svelte';
	import Spacer from './Spacer.svelte';
	import Email from './Email.svelte';
	import Pattern from './Pattern.svelte';
	import PromptingDescription from './PromptingDescription.svelte';
	import YesNoNaw from './Selector/YesNoNaw.svelte';
	import MapComponent from '../Map/Map.svelte';
	import UserReport from '../UserReport/UserReport.svelte';
	import { getContext, mount, unmount } from 'svelte';

	interface Props {
		uid: string;
	}
	let props: Props = $props();
	const uid = props.uid;

	// map related variables
	let L: typeof import('leaflet');
	const streets: typeof import('$lib/streets') = getContext('streets');
	let map: Map;
	let mapLayer: GeoJSON<LineString, Geometry>;
	let popup: Record<string, string> | null = null;

	// state
	let feature = $state() as Feature;
	let midPoint = $state() as Position;
	let featureProps = $state() as FeatureAttrs;
	let featureError = $state() as Error;
	let page = $state(0) as number;

	let description = $state('');
	let email = $state('');

	let page1Class = $derived(!page || page === 0 ? 'contents' : 'hidden');
	let page2Class = $derived(page === 1 ? 'contents' : 'hidden');
	let page3Class = $derived(page === 2 ? 'contents' : 'hidden');
	const mapSetupFn: Map_Props['setup'] = (leaflet, newMap) => {
		L = leaflet;
		map = newMap;
		map.on('popupclose', () => {
			if (popup) {
				unmount(popup);
				popup = null;
			}
		});
		mapLayer = L.geoJSON<LineString>(null, {
			interactive: false,
			style: generateLineStyle,
			pointToLayer: (_geoJsonPoint, latlng) => {
				return L.circle(latlng, { radius: 15 });
			},
		}).addTo(map);

		streets
			.getFeature(uid)
			.then((f) => {
				feature = f;
				midPoint = findMidPoint(f.geometry);
				featureProps = f.properties as unknown as FeatureAttrs;
			})
			.then(addStreetLine) // adds the line to the map!
			.catch((e) => {
				console.log(`Caught error fetching feature`, e);
				featureError = e as Error;
			});
	};

	function addStreetLine() {
		mapLayer.addData(feature);
		map.flyToBounds(mapLayer.getBounds().pad(4));
	}

	function completeForm(e: SubmitEvent) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		formData.entries().forEach((v) => {
			console.log(v);
		});
		if (page === 0) {
			mapLayer.clearLayers();
			generateMapPoint(formData);
		}
		page++;
		window.scrollTo({ top: 0 });
	}

	function goBackToPage0() {
		mapLayer.closePopup();
		mapLayer.clearLayers();
		addStreetLine();
		page = 0;
	}

	function generateMapPoint(formData: FormData) {
		const geo = formData.get('geo') as string | null;
		const desc = formData.get('description') as string;
		mapLayer.addData(decodePosition(geo));
		if (desc) {
			mapLayer
				.bindPopup(
					() => {
						const div = document.createElement('div');
						popup = mount(UserReport, {
							target: div,
							props: { description: desc },
						});
						return div;
					},
					{
						closeOnClick: false,
						closeOnEscapeKey: false,
						autoClose: false,
						closeButton: false,
					}
				)
				.addTo(map)
				.openPopup();
		}
	}

	function decodePosition(encodedPosition: string | null): Point {
		if (encodedPosition) {
			const position = JSON.parse(encodedPosition) as Position;
			return {
				type: 'Point',
				coordinates: position,
			};
		}
		throw new Error("couldn't find the geolocation for your report");
	}

	function encodePosition(position: Position): string {
		// let long = position[0];
		// let lat = position[1];
		return JSON.stringify(position);
	}
</script>

<div class="max-w-prose prose-xl text-center">
	{#if !featureError && !feature}
		<h1>Loading...</h1>
	{:else if feature}
		<h1>Tell me about {featureProps.STNAME_ORD}</h1>
	{:else}
		<h1>
			<span class="text-red-500">Error</span>: {featureError.message || 'Failed to find street'}
		</h1>
	{/if}
</div>
<MapComponent inert setup={mapSetupFn} class="h-60"></MapComponent>
{#if page == 0}
	<a href="/" class="block w-full text-center {color[3]} py-2 rounded-b"
		>&larr; Pick a different street</a
	>
{:else}
	<button class="block w-full text-center {color[2]} py-2 rounded-b" onclick={goBackToPage0}
		>&larr; Edit your report</button
	>
{/if}
{#if feature}
	<form onsubmit={completeForm}>
		<input name="page" type="hidden" value={page} />
		<input name="uid" type="hidden" value={uid} />
		<input name="uiddesc" type="hidden" value={featureProps.UNITDESC} />
		<input name="artclass" type="hidden" value={featureProps.ARTCLASS} />
		<input name="artdesc" type="hidden" value={featureProps.ARTDESCRIPT} />
		<input name="geo" type="hidden" value={encodePosition(midPoint)} />
		<input name="district" type="hidden" value={featureProps.PRIMARYDISTRICTCD} />
		<fieldset id="page1" class={page1Class}>
			{#if featureProps.ARTCLASS == 0}
				<PromptingDescription
					id="description"
					name="description"
					suggestions={[
						`There's cut through traffic from `,
						`Cars speed down ${featureProps.STNAME_ORD.toLowerCase()} `,
						`It's hard to cross ${featureProps.STNAME_ORD.toLowerCase()} because `,
						`Cars are parked where it's not safe. They park `,
					]}
					bind:value={description}
					{email}
				/>

				<Spacer height="medium" />

				<Pattern />

				<Spacer height="medium" />

				{#snippet liveNearbyPrompt()}
					<p>Is this local traffic?</p>
					<p class="text text-gray-400 px-2">
						Are the vehicles heading to a home or business in this neighorhood?
					</p>
				{/snippet}

				<YesNoNaw name="livenearby" prompt={liveNearbyPrompt} />
			{:else}
				<p class="my-1">
					<b>This road is designated for through traffic vehicles</b>. We'd still like to hear your
					thoughts on this road!
				</p>
				<p class="my-1">
					Arterials are a necessity for traffic to get around the city. However, they should not
					divide the neighborhoods, and they still have to be safe for people to cross and navigate.
				</p>

				<!--TODO: add a popup definition for arterial?-->
				{#snippet dedesignatePrompt()}
					Do you think this road should continue to be an arterial?
				{/snippet}
				<YesNoNaw name="dedesignate" prompt={dedesignatePrompt} />

				<PromptingDescription
					id="description"
					name="description"
					suggestions={[
						`It's challenging to cross ${featureProps.STNAME_ORD.toLowerCase()} near ${featureProps.XSTRHI.toLowerCase()} because `,
						`I feel unsafe walking along ${featureProps.STNAME_ORD.toLowerCase()} between ${featureProps.XSTRHI.toLowerCase()} and ${featureProps.XSTRLO.toLowerCase()} because `,
						`I don't think ${featureProps.STNAME_ORD.toLocaleLowerCase()} should be an arterial because there's a better route on `,
						`Cars drive dangerously fast on ${featureProps.STNAME_ORD.toLocaleLowerCase()}, the city should `,
						`Sidewalks are needed here `,
						`I don't think ${featureProps.STNAME_ORD.toLocaleLowerCase()} should be an arterial. Cars should go around via `,
					]}
					bind:value={description}
					{email}
				/>
			{/if}
			<hr class="my-7" />
			<h2 class="text-2xl"><b>Tell me about you!</b></h2>
			<LivesNearby />

			<Spacer height="medium" />

			<Email {description} bind:value={email} />

			<Spacer height="medium" />

			<input
				class="block w-full {color[1]} rounded"
				type="submit"
				value="Publish to Map (and continue)"
			/>
		</fieldset>
		<fieldset id="page2" class={page2Class}>
			<h2 class="text-2xl max-w-prose text-center">&#127881;Thanks for submitting&#x1F389;</h2>
      
			<Spacer height="medium" />

			<p>
				To better understand this neighborhood, I'd appreciate a little bit more information. This
				page is optional
			</p>
			{#if featureProps.ARTCLASS == 0}
				<div class="bg-black border rounded-md grid py-2 px-3 mt-5">
					<h2 class="text-xl">Where are drivers typically coming from and heading to?</h2>
					<p class="text text-gray-400 px-2">This will not be published publicly</p>
					<textarea
						id="badusageroute"
						class="rounded h-20 text-black"
						name="badusageroute"
						placeholder="Source? Destination?"
						maxlength="5000"
					></textarea>
				</div>
			{/if}
			<div class="bg-black border rounded-md grid py-2 px-3 mt-5">
				<h2 class="text-xl">How do you think we could change this?</h2>
				<p class="text text-gray-400 px-2">This will not be published publicly</p>
				<textarea
					id="solution"
					class="rounded h-20 text-black"
					name="solution"
					placeholder="How might we fix this?"
					maxlength="5000"
				></textarea>
			</div>

			<Spacer height="medium" />

			<input
				class="block w-full {color[1]} rounded"
				type="submit"
				value="Save additional information"
			/>
		</fieldset>
		<div id="page3" class={page3Class}>
			<h2 class="text-2xl text-center">Thanks for helping calm your street</h2>
			<div class="flex w-full">
				<a class="text-center flex-auto block w-full {color[0]} rounded m-2" href="/"
					>Report another issue</a
				>
				<button
					class="text-center flex-auto block w-full {color[0]} rounded m-2"
					onclick={share}
					type="button">Share it with your neighborhood</button
				>
			</div>
		</div>
	</form>
{/if}
