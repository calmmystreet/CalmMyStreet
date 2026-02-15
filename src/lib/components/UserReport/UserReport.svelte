<script lang="ts">
	interface Props {
		descriptions: string[];
		updated_at?: string;
		votes?: number;
		uid?: string;
	}
	let { descriptions, updated_at, votes, uid }: Props = $props();
	const reportLink = '/report/?uid=' + uid;
	const p1Link = '/report/?uid=' + uid + '&hidedesc';
	const dateString = setDateString(updated_at);
	function setDateString(inputDate: string | undefined): string {
		let d = new Date(); // now
		if (inputDate) {
			const [year, month, day] = inputDate.split('-').map(Number);
			d = new Date(Date.UTC(year, month - 1, day));
		}
		return d
			.toLocaleDateString('en-US', { year: '2-digit', month: 'short' })
			.replace(/ (\d{2})$/, " '$1");
	}
</script>

<div class="min-w-[280px] max-w-m font-sans text-gray-800 p-1">
	<div class="flex justify-between items-start mb-2 gap-4">
		<div class="flex flex-col gap-0.5 max-h-30 overflow-y-scroll">
			{#each descriptions as description, i (i)}
				<p class="text-sm text-gray-600 my-1!">{description}</p>
				{#if i < descriptions.length - 1}
					<div class="w-full border-b border-gray-200"></div>
				{/if}
			{/each}
		</div>

		<div class="flex flex-col items-end text-right">
			<span class="text-xs font-medium text-gray-500 mb-1 transition-all duration-300">
				Last reported
				<br />
				{dateString}
			</span>

			<!-- TODO: add a flow here
			<button
				onclick={toggleResolved}
				class="text-[10px] underline decoration-dotted hover:text-blue-600 text-gray-400 whitespace-nowrap cursor-pointer transition-colors"
			>
				Not an issue?
			</button> -->
		</div>
	</div>

	{#if votes}
		<hr class="border-gray-200 my-1" />
		<div class="flex justify-between items-center gap-2">
			<a
				href={reportLink}
				class="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline leading-none"
			>
				Report another issue
			</a>

			<a
				href={p1Link}
				class="group flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm transition-all bg-white hover:bg-gray-50 hover:border-gray-300"
			>
				<span class="text-sm font-bold">+1 this spot</span>
				<span
					class="bg-gray-100 group-hover:bg-white text-xs font-mono py-0.5 px-1.5 rounded border border-gray-200"
				>
					{votes}
				</span>
			</a>
		</div>
	{/if}
</div>
