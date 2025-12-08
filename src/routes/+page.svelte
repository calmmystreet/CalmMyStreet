<script lang="ts">
	import StreetPicker from '$lib/components/StreetPicker/StreetPicker.svelte';
</script>

<article id="welcome" class="max-w-prose mx-auto prose-base lg:prose-xl text-white">
	<h1 class="text-pretty">Our streets are for us</h1>
	<h2>Let's tell the city what we want from our streets.</h2>
	<p>
		You and those you love deserve a safe and livable neighborhood. Children should not be afraid to
		play in the street, and you shouldn't be afraid to cross it.
		<u>Our neighborhood streets are for us</u>.
	</p>
	<p>
		By reporting neighborhood streets being used for non-local traffic, we hope to make you and your
		neighbors safer while creating a more peaceful place for you to live. Tap the map below to share
		your experience and help us make your street <b>calm</b>.
	</p>
</article>
<StreetPicker class="h-[80vh]" />
