import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('should render a map', async () => {
		render(Page);

		const map = page.getByTestId('map');
		await expect.element(map).toBeInTheDocument();

		// Wait for the map to be initialized and have children
		await vi.waitFor(
			() => {
				expect(map.element().children.length).toBeGreaterThan(0);
			},
			{ timeout: 5000 }
		);
	});
});
