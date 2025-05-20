<script>
	import { h1, participants } from '@src/data.js';
	import Layout from '@src/pages/orgs/$org/layout.svelte';
	import { pluralize, sortAsc, sortDesc } from '@src/util.js'

	const ATTENDS_MIN = 4;

	const results = participants
		.filter((p) => p.attendsCount >= ATTENDS_MIN)
		.map((p) => {
			const sortValue = (p.organizesCount + 1) / (p.attendsCount + 1);
			return { ...p, sortValue };
		})
		.sort((a, b) => {
			const sortValue = sortAsc('sortValue')(a, b);
			const attendsCount = sortDesc('attendsCount')(a, b);
			return sortValue === 0 ? attendsCount : sortValue;
		});
</script>

<Layout>
	<div>
		<h1>{h1}</h1>
	</div>
	<h2 class="u-text-normal u-ts-1">{results.length} {pluralize(results.length, 'hasher')} ran at least {ATTENDS_MIN} times in the last year</h2>
	<h3 class="h2">
		Hares / Runs
	</h3>
	<ul class="list-plain u-gap-2px u-m-top-2">
		{#each results as p}
			<li class="row">
				<a class="row__content" href={p.url}>
					<span class="row__primary">{p.displayName}</span>
					<span class="row__secondary">{p.fullName}</span>
					<span class="row__tertiary u-right u-text-num">
						{p.organizesCount} / {p.attendsCount}
					</span>
				</a>
			</li>
		{/each}
	</ul>
</Layout>
