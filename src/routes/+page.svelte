<script lang="ts">
	import StreetPicker from '$lib/components/StreetPicker/StreetPicker.svelte';
</script>

<article id="welcome" class="max-w-prose mx-auto prose-base lg:prose-xl text-white">
	<h1 class="text-pretty">Our streets are for us</h1>
	<h2>Tell us what you want.</h2>
	<p>
		We're creating a map of where people feel unsafe.
		<b>Drop a pin and tell your story of drivers make you feel unsafe on our streets.</b>
		Our streets shouldn't be unsafe for you or your loved ones to navigate, nor to cross.
	</p>
	<p>
		By reporting where roads are unsafe we can come together and make them better! Tap the map below
		to share your experience and document where a <b>calmer</b> street is needed.
	</p>
</article>
<StreetPicker class="h-[80vh]" />
