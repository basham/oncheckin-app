<script>
	import { h1, org, orgEvent } from '@src/data.js';
	import Layout from '@src/pages/orgs/$org/layout.svelte';
</script>

<Layout>
	<h1>{h1}</h1>
	<p class="u-m-top-4">
		<a href="/orgs/">Back to organizations</a>
	</p>
	<h2>This organization</h2>
	<div class="card u-m-top-2">
		<p>
			<span class="u-color-hint">Name:</span>
			{org.name}
		</p>
		<p>
			<span class="u-color-hint">ID:</span>
			{org.id}
		</p>
		<ul class="list-plain list-plain--inline u-gap-4 u-m-top-4">
			<li><a href={`${org.url}share/`}>Share</a></li>
			<li><a href={`/api/orgs/${org.id}.json`}>Download</a></li>
			<li><a href={`${org.url}rename/`}>Rename</a></li>
			<li><a href={`${org.url}delete/`}>Delete</a></li>
		</ul>
	</div>
	<div class="card u-m-top-2">
		<p>
			<span class="u-color-hint">Event count:</span>
			{orgEvent.count.value}
			(as of {orgEvent.count.date})
		</p>
		<ul class="list-plain list-plain--inline u-gap-4 u-m-top-4">
			<li><a href={`${org.url}event-count/`}>Edit event count</a></li>
		</ul>
	</div>
</Layout>
