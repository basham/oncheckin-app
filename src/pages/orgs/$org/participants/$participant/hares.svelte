<script>
	import { checkInsByYear } from '@src/data.js';
	import { pluralize } from '@src/util.js';
	import Layout from './layout.svelte';
</script>

<Layout>
	{#if !checkInsByYear.length}
		<h2>No hares</h2>
	{/if}
	{#each checkInsByYear as [year, checkIns]}
		<h2>
			{year}
			<span class="badge">{checkIns.length}</span>
		</h2>
		<ul class="list-plain u-gap-2px u-m-top-2">
			{#each checkIns as checkIn}
				<li class="row">
					<a class="row__content" href={checkIn.event.url}>
						<span class="row__primary">{checkIn.event.name}</span>
						<span class="row__secondary u-text-num">
							{`#${checkIn.event.count}: ${checkIn.event.displayDateMedium}`}
						</span>
						<span class="row__tertiary u-text-num">
							{`${checkIn.hostCount} ${pluralize(checkIn.hostCount, 'hare')}`}
						</span>
					</a>
				</li>
			{/each}
		</ul>
	{/each}
</Layout>
