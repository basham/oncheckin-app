<script>
	import { h1, org, params, participants } from '@src/data.js';
	import Layout from '@src/pages/orgs/$org/layout.svelte';
	import Participants from '@src/lib/participants.svelte';
	import Icon from '@src/lib/icon.svelte';
	import { pluralize, sortDesc } from '@src/util.js'

	const location = document.location.toString();
	const filters = [
		['Named', 'named', 'true'],
		['Not named', 'named', 'false'],
		['Ready for name', 'named', 'ready'],
		['By last event', 'sort', 'event'],
		['By hashes', 'sort', 'runs'],
		['By hares', 'sort', 'hosts'],
		['By name', 'sort', 'name']
	].map(([label, key, value]) => {
		const { searchParams } = new URL(location);
		const active = params[key] === value;
		if (active) {
			searchParams.delete(key);
		} else {
			searchParams.set(key, value);
		}
		const url = `?${searchParams}`;
		return { active, label, url };
	});

	const sortOptions = {
		event: sortByEvent,
		runs: sortByRunCount,
		hosts: sortByHostCount,
		name: sortByName
	};
	const groups = sortOptions[params.sort]();

	function sortByEvent () {
		const events = new Map();
		const groups = new Map();
		participants.forEach((p) => {
			if (!p.lastEvent) {
				return;
			}
			const { id } = p.lastEvent;
			if (!events.has(id)) {
				events.set(id, p.lastEvent);
			}
			if (!groups.has(id)) {
				groups.set(id, new Set());
			}
			groups.get(id).add(p);
		});
		return [...events.values()]
			.sort(sortDesc('count'))
			.map((event) => {
				const { displayDateLong: name, count, id, url } = event;
				const description = `#${count}`;
				const items = [...groups.get(id).values()];
				return {
					name,
					description,
					url,
					items
				};
			});
	}

	function sortByRunCount () {
		const groups = new Map();
		participants.forEach((p) => {
			const { runCount } = p;
			if (!groups.has(runCount)) {
				groups.set(runCount, new Set());
			}
			groups.get(runCount).add(p);
		});
		return [...groups.keys()]
			.sort((a, b) => a - b)
			.reverse()
			.map((runCount) => {
				const name = runCount;
				const items = [...groups.get(runCount).values()];
				return {
					name,
					items
				};
			});
	}

	function sortByHostCount () {
		const groups = new Map();
		participants.forEach((p) => {
			const { hostCount } = p;
			if (!groups.has(hostCount)) {
				groups.set(hostCount, new Set());
			}
			groups.get(hostCount).add(p);
		});
		return [...groups.keys()]
			.sort((a, b) => a - b)
			.reverse()
			.map((hostCount) => {
				const name = hostCount;
				const items = [...groups.get(hostCount).values()];
				return {
					name,
					items
				};
			});
	}

	function sortByName () {
		const groups = new Map();
		participants.forEach((p) => {
			const { alias = '', fullName = '' } = p;
			const firstLetter = (alias || fullName)[0]?.toUpperCase();
			if (!groups.has(firstLetter)) {
				groups.set(firstLetter, new Set());
			}
			groups.get(firstLetter).add(p);
		});
		return [...groups.keys()]
			.sort()
			.map((firstLetter) => {
				const name = firstLetter;
				const items = [...groups.get(firstLetter).values()];
				return {
					name,
					items
				};
			});
	}
</script>

<Layout>
	<div class="u-flex u-flex-end u-flex-space">
		<h1>{h1}</h1>
		<div>
			<a class="button button--primary" href={`${org.url}participants/new/`}>
				New hasher
			</a>
		</div>
	</div>
	<h2>Reports</h2>
	<ul class="list-plain u-gap-2px u-m-top-2">
		<li class="row">
			<a class="row__content" href="participation">
				<span class="row__primary">
					Participation
				</span>
				<span class="row__secondary">
					Find hashers to hare upcoming events.
				</span>
			</a>
		</li>
	</ul>
	<h2>Filter</h2>
	<ul class="list-plain list-plain--inline u-gap-2px u-m-top-2">
		{#each filters as filter}
			<li class="row">
				<a
					aria-current={filter.active ? 'true' : null}
					class="row__content"
					href={`${filter.url}`}
				>
					<span class="row__primary u-flex u-flex-center u-gap-2">
						<span>{filter.label}</span>
						{#if filter.active}
							<Icon name="close" />
							<span class="u-sr-only">(clear)</span>
						{/if}
					</span>
				</a>
			</li>
		{/each}
	</ul>
	<h2 class="u-text-normal u-ts-1">Showing {participants.length} {pluralize(participants.length, 'result')}</h2>
	{#each groups as group}
		<h3 class="h2">
			{group.name}
			{#if group.description}
				<span class="badge">
					{#if group.url}
						<a href={group.url}>{group.description}</a>
					{:else}
						{group.description}
					{/if}
				</span>
			{/if}
		</h3>
		<Participants participants={group.items} />
	{/each}
</Layout>
