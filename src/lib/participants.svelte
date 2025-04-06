<script>
	let { participants = [] } = $props();
</script>

<ul class="list-plain u-gap-2px u-m-top-2">
	{#each participants as p}
		<li class="row">
			<a class="row__content" href={p.url}>
				<span class="row__primary">{p.displayName}</span>
				<span class="row__secondary">{p.fullName}</span>
			</a>
		</li>
	{/each}
</ul>
