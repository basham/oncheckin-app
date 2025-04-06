<script>
	import Layout from '@src/pages/layout.svelte';
</script>

<Layout>
	<ul class="list-plain u-gap-2px u-m-top-4">
		<li class="row">
			<a class="row__content" href="/orgs/new/">
				<span class="row__primary">Create new organization</span>
			</a>
		</li>
		<li class="row">
			<a class="row__content" href="/orgs/code/">
				<span class="row__primary">Enter invite code to join organization</span>
			</a>
		</li>
		<li class="row">
			<a class="row__content" href="/orgs/scan/">
				<span class="row__primary">Scan invite code to join organization</span>
			</a>
		</li>
		<li class="row">
			<a class="row__content" href="/orgs/import/">
				<span class="row__primary">Import organization from file</span>
			</a>
		</li>
	</ul>
	<div class="u-m-top-6">
		<a href="/orgs/">Back to organizations</a>
	</div>
</Layout>
