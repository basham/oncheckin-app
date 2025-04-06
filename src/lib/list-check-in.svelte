<script>
	import { pluralize } from '@src/util.js';

	let {
		checkIns = [],
		showCheckInCount = false,
		showHostCount = false,
		showLastEventDate = false
	} = $props();
</script>

{#if checkIns.length}
	<ul class="list-plain u-gap-2px">
		{#each checkIns as checkIn}
			<li class="row">
				<a class="row__content" href={checkIn.url}>
					<span class="row__primary">{checkIn.participant.displayName}</span>
					<span class="row__secondary">{checkIn.participant.fullName}</span>
					<span class="row__tertiary u-right u-text-num">
						{#if showHostCount && checkIn.host}
							<span class="u-block">
								{`${checkIn.hostCount || '?'} ${pluralize(
									checkIn.hostCount,
									'hare'
								)}`}
							</span>
						{/if}
						{#if showCheckInCount}
							<span class="u-block">
								{`${checkIn.runCount || '?'} ${pluralize(checkIn.runCount, 'run')}`}
							</span>
						{/if}
						{#if showLastEventDate}
							<span class="u-block">
								{checkIn.lastEvent.displayDateLong}
							</span>
						{/if}
					</span>
				</a>
			</li>
		{/each}
	</ul>
{/if}
