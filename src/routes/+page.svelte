<script lang="ts">
	import StreetPicker from '$lib/components/StreetPicker/StreetPicker.svelte';
</script>

<article id="welcome" class="max-w-prose mx-auto prose-base lg:prose-xl text-white">
	<h1 class="text-pretty">Our streets are for us</h1>
	<h2>Let's tell the city of Seattle what we want from our streets.</h2>
	<p>
		Our communities deserve safe and livable neighborhoods. Children should not be afraid to play in
		the street, and you shouldn't be afraid to cross it.
		<u>Neighborhood streets are for us</u>.
	</p>
	<p>
		By reporting neighborhood streets being used for non-local traffic, we hope to make your
		communities safer while creating a more peaceful place to live. Tap the map below to share your
		experience and request to make your street <b>calm</b>.
	</p>
</article>
<StreetPicker class="h-[80vh]" />
