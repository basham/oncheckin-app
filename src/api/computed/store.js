import { getOrCreate, pipe } from '@src/util.js';
import { loadStore } from '../entity.js';
import { getCheckInData } from './check-in.js';
import { getEventData } from './event.js';
import { getOrgData } from './org.js';
import { getParticipantData } from './participant.js';

const cache = new Map();

const pipeline = pipe(
	getOrgData,
	getEventData,
	getParticipantData,
	getCheckInData
);

export function Store(orgId) {
	return getOrCreate(cache, orgId, () => compute(orgId));
}

async function compute(orgId) {
	const store = await loadStore(orgId);
	store.data.observeDeep(function () {
		cache.delete(orgId);
		store.data.unobserveDeep(this);
	});
	return pipeline({ store });
}
