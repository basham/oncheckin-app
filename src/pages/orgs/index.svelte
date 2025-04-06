<script>
	import { device, account, orgs } from '@src/data.js';
	import Layout from '@src/pages/layout.svelte';
</script>

<Layout>
	<div class="u-m-top-4">{account.name} ({device.name})</div>
	<div class="u-flex u-gap-4 u-m-top-6">
		<a class="button button--primary" href="/orgs/add/">Add organization</a>
	</div>
	{#if orgs.length}
		<h2>All organizations</h2>
		<ul class="list-plain u-gap-2px u-m-top-2">
			{#each orgs as org}
				<li class="row">
					<a class="row__content" href={org.url}>
						<span class="row__primary">{org.name}</span>
						<span class="row__secondary">{`ID: ${org.id}`}</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</Layout>
