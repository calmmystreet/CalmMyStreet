<script lang="ts">
	import StreetPicker from '$lib/components/StreetPicker/StreetPicker.svelte';
</script>

<article id="welcome" class="max-w-prose mx-auto prose-base lg:prose-xl text-white">
	<h1 class="text-pretty">Calm My Street</h1>
	<h2>Report where you feel unsafe on our streets</h2>
	<p>
		We're creating a map of where people feel unsafe.
		<b>Drop a pin and tell your story of drivers making you feel unsafe on our streets.</b>
		Our streets shouldn't be unsafe for you or your loved ones to navigate or cross.
	</p>
	<p>
		By reporting where roads are unsafe we can come together and make them better! Tap the map below
		to share your experience and document where a <b>calmer</b> street is needed.
	</p>
</article>
<StreetPicker class="h-[80vh]" />
