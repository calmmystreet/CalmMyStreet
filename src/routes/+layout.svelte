<script lang="ts">
	import './layout.css';
	import * as streets from '$lib/streets';
	import { color } from '$lib/constants';
	import { onMount, setContext } from 'svelte';
	onMount(streets.onMount);
	setContext('streets', streets);

	let { children } = $props();
</script>

<svelte:head>
	<title>Calm My Street</title>
	<link rel="manifest" href="/site.webmanifest" />
	<link rel="icon" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="icon" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" sizes="48x48" href="/favicon.ico" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</svelte:head>

<div class="min-h-screen pt-6 {color[0]} flex flex-col justify-center overflow-hidden lg:pt-12">
	<div
		class="w-full px-6 pt-8 pb-4 bg-gray-800 shadow-xl shadow-slate-700/10 ring-black/5 md:max-w-3xl md:mx-auto lg:max-w-4xl lg:pt-16 rounded-t-lg"
	>
		{@render children()}
	</div>
</div>
