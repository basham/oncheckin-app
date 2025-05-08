import { getOrCreate, pipe } from '@src/util.js';
import { loadStore } from '../entity.js';
import { getCheckInData } from './check-in.js';
import { getEventData } from './event.js';
import { getOrgData } from './org.js';
import { getParticipantData } from './participant.js';
import { getParticipationData } from './participation.js';

const cache = new Map();

export function Store(orgId) {
	return getOrCreate(cache, orgId, () => compute(orgId));
}

async function compute(orgId) {
	const store = await loadStore(orgId);
	store.data.observeDeep(function () {
		cache.delete(orgId);
		store.data.unobserveDeep(this);
	});
	return pipe(
		{ store },
		getOrgData,
		getEventData,
		getParticipantData,
		getCheckInData,
		getParticipationData
	);
}
