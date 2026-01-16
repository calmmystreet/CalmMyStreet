<script lang="ts">
	import StreetPicker from '$lib/components/StreetPicker/StreetPicker.svelte';
</script>

<article id="welcome" class="max-w-prose mx-auto prose-base lg:prose-xl text-white">
	<h1 class="text-pretty">Our streets are for us</h1>
	<h2>Tell us what you want.</h2>
	<p>
		Our communities deserve safe, livable neighborhoods. Children should not be afraid to play in
		the street, and you shouldn't be afraid to cross it.
		<u>Streets are for us</u>.
	</p>
	<p>
		By reporting where roads are unsafe we can come together and make them better! Tap the map below
		to share your experience and document where a <b>calmer</b> street is needed.
	</p>
</article>
<StreetPicker class="h-[80vh]" />
