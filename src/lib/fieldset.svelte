<script>
	export let legend = '';
</script>

<div class={`card u-m-top-4 ${$$props.class}`}>
	<fieldset class="u-m-0 u-p-0">
		<legend class="u-p-0 u-ts-2">{legend}</legend>
		<slot />
	</fieldset>
</div>

<style>
	fieldset {
		border: none;
		display: block;
	}
</style>
