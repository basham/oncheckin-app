<script>
	import { SvelteSet } from 'svelte/reactivity';
	import { runners } from '@src/data.js';
	import Icon from '@src/lib/icon.svelte';
	import Layout from './layout.svelte';

	const runnersMap = new Map(
		runners.map((checkIn) => [checkIn.participant.id, checkIn])
	);

	let arrivedIds = $state(new SvelteSet());
	let waiting = $derived(runners.filter(
		({ participant }) => !arrivedIds.has(participant.id)
	));
	let arrived = $derived([...arrivedIds].map((id) => runnersMap.get(id)).reverse());

	function markAsArrived(event) {
		const { id } = event.target.dataset;
		arrivedIds.add(id);
	}

	function markAsWaiting(event) {
		const { id } = event.target.dataset;
		arrivedIds.delete(id);
	}

	function reset() {
		arrivedIds.clear();
	}
</script>

<Layout>
	<h2>
		Waiting <span class="badge">{waiting.length}</span>
	</h2>
	{#if waiting.length}
		<ul class="list-plain u-gap-2px u-m-top-2">
			{#each waiting as checkIn}
				<li class="row">
					<a
						class="row__content"
						href={checkIn.participant.url}
						id={checkIn.participant.id}
					>
						<span class="row__primary">{checkIn.participant.displayName}</span>
						<span class="row__secondary">{checkIn.participant.fullName}</span>
					</a>
					<span class="row__actions">
						<button
							aria-describedby={checkIn.participant.id}
							class="button button--primary"
							data-id={checkIn.participant.id}
							onclick={markAsArrived}
						>
							Arrived
						</button>
					</span>
				</li>
			{/each}
		</ul>
	{/if}
	<div class="u-flex u-flex-end u-flex-space">
		<h2>
			Arrived <span class="badge">{arrived.length}</span>
		</h2>
		{#if arrived.length}
			<div class="u-m-top-2">
				<button class="button button--plain" onclick={reset}>Reset</button>
			</div>
		{/if}
	</div>
	{#if arrived.length}
		<ul class="list-plain u-gap-2px u-m-top-2">
			{#each arrived as checkIn}
				<li class="row">
					<a
						class="row__content"
						href={checkIn.participant.url}
						id={checkIn.participant.id}
					>
						<span class="row__primary">{checkIn.participant.displayName}</span>
						<span class="row__secondary">{checkIn.participant.fullName}</span>
					</a>
					<span class="row__actions">
						<button
							aria-describedby={checkIn.participant.id}
							class="button"
							data-id={checkIn.participant.id}
							onclick={markAsWaiting}
						>
							<span class="u-sr-only">Remove</span>
							<Icon name="close" />
						</button>
					</span>
				</li>
			{/each}
		</ul>
	{/if}
</Layout>
