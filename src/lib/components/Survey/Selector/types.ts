import type { Snippet } from 'svelte';

export interface PresetProps {
	name: string;
	prompt?: Snippet;
	promptText?: string;
	unselectedLabel?: string;
	value?: string;
}

export interface Props extends PresetProps {
	fields: string[];
}
