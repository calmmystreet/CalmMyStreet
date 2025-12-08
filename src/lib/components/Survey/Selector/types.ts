export interface PresetProps {
	name: string;
	unselectedLabel?: string;
}

export interface Props extends PresetProps {
	fields: string[];
}
