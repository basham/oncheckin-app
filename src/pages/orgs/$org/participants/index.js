import { Store } from '@src/api/computed/store.js';

const namedValues = 'all|true|false|ready'.split('|');
const sortValues = 'event|runs|hosts|name'.split('|');

export async function get({ data }) {
	const { org } = data;
	const params = {
		named: namedValues.includes(data.named) ? data.named : namedValues[0],
		sort: sortValues.includes(data.sort) ? data.sort : sortValues[0]
	};
	const h1 = 'Hashers';
	const {
		participants: allParticipants,
		checkInsByParticipantId
	} = await Store(org.id);

	const participants = allParticipants
		.map((p) => {
			const participantCheckIns = checkInsByParticipantId.get(p.id)
			const lastCheckIn = participantCheckIns[0];
			const lastEvent = lastCheckIn?.event;
			const latestCheckIn = lastCheckIn || {};
			const { hostCount = 0, runCount = 0 } = latestCheckIn;
			const namedStatus = getNamedStatus({ alias: p.alias, runCount });
			return {
				...p,
				hostCount,
				lastEvent,
				namedStatus,
				runCount
			};
		})
		.filter((p) => {
			if (params.named === namedValues[0]) {
				return true;
			}
			if (p.namedStatus.includes(params.named)) {
				return true;
			}
			return false;
		})
		.filter((p) => {
			if (params.sort === 'hosts') {
				return p.hostCount > 0;
			}
			if (params.sort === 'runs') {
				return p.runCount > 0;
			}
			return true;
		});

	const template = { h1, params, participants };
	return { template };
}

function getNamedStatus ({ alias, runCount }) {
	if (alias) {
		return ['true'];
	}
	if (runCount >= 5) {
		return ['ready', 'false'];
	}
	return ['false'];
}
