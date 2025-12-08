<script lang="ts">
	import type { Props } from './types';

	let { name, fields, unselectedLabel }: Props = $props();
</script>

<fieldset {name} class="border rounded">
	{#each fields as field (field)}
		<input type="radio" id={name + '_' + field} {name} value={field} />
		<label for={name + '_' + field} class="flex-auto">{field}</label>
	{/each}
	<label class="unselector hidden" for={name + '_'}>{unselectedLabel || 'x'}</label>
	<input type="radio" id={name + '_'} {name} value="" class="hidden" />
</fieldset>

<style>
	fieldset > input:checked ~ label.unselector {
		display: inline-block;
	}
</style>
