<script>
	let {
		href,
		id = null,
		location = null,
		children
	} = $props();
</script>

<a aria-current={location === id ? 'page' : null} {href}>
	{@render children?.()}
</a>

<style>
	a {
		color: var(--color-b-8);
		font-weight: bold;
		line-height: 1;
		padding: var(--size-2) 0;
		text-decoration: none;
	}

	a:hover,
	a[aria-current] {
		color: inherit;
	}

	a[aria-current] {
		text-decoration: underline;
		text-decoration-color: var(--color-p-7);
		text-decoration-thickness: var(--px-2);
		text-underline-offset: var(--size-2);
	}
</style>
