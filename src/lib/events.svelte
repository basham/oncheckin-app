<script>
	let { events = [] } = $props();
</script>

{#if events.length}
	<ul class="list-plain u-gap-2px u-m-top-2">
		{#each events as event}
			<li class="row">
				<a class="row__content" href={event.url}>
					<span class="row__primary">{event.name}</span>
					<span class="row__secondary u-text-num">
						{`#${event.count}: ${event.displayDateMedium}`}
					</span>
				</a>
			</li>
		{/each}
	</ul>
{/if}
