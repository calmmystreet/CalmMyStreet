<script lang="ts">
	import type { PageProps } from './$types';

	import Survey from '$lib/components/Survey/Survey.svelte';

	let props: PageProps = $props();
</script>

<Survey uid={props.data.uid!} />
