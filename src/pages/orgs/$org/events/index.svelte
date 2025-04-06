<script>
	import { h1, org, upcomingEvents, recentEvents, years } from '@src/data.js';
	import Layout from '@src/pages/orgs/$org/layout.svelte';
	import Events from '@src/lib/events.svelte';
</script>

<Layout>
	<div class="u-flex u-flex-end u-flex-space">
		<h1>{h1}</h1>
		<div>
			<a class="button button--primary" href={`${org.url}events/new`}>
				New event
			</a>
		</div>
	</div>
	<h2>
		Upcoming events <span class="badge">{upcomingEvents.length}</span>
	</h2>
	<Events events={upcomingEvents} />
	<h2>Recent events</h2>
	<Events events={recentEvents} />
	<h2>Past events</h2>
	<ul class="list-plain list-plain--inline u-gap-2px u-m-top-2">
		{#each years as year}
			<li class="row">
				<a class="row__content u-text-num" href={`${org.url}events/year/${year}/`}>
					<span class="row__primary">{year}</span>
				</a>
			</li>
		{/each}
	</ul>
</Layout>
