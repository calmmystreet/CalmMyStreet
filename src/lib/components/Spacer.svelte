<script lang="ts">
	interface Props {
		height: string;
	}
	let { height }: Props = $props();
	let cls: string = $derived.by(() => {
		switch (height) {
			case 'small':
				return 'my-3';
			case 'medium':
				return 'my-5';
			case 'large':
				return 'my-7';
			default:
				return '';
		}
	});
</script>

<div class={cls}></div>
