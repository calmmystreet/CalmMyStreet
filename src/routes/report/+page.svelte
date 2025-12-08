<script lang="ts">
	import type { PageProps } from './$types';

	import SurveyHeader from '$lib/components/SurveyHeader/SurveyHeader.svelte';
	import Survey from '$lib/components/Survey/Survey.svelte';
	import { color } from '$lib/constants';

	let props: PageProps = $props();
</script>

<SurveyHeader oid={props.data.oid!} />
<a href="/" class="block w-full text-center {color[3]} py-2 rounded-b"
	>&larr; Pick a different street</a
>
<Survey oid={props.data.oid!} />
