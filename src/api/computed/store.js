import { getOrCreate } from '@src/util.js';
import { loadStore } from '../entity.js';
import { getCheckInData } from './check-in.js';
import { getEventData } from './event.js';
import { getOrgData } from './org.js';
import { getParticipantData } from './participant.js';

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
	const orgData = getOrgData(store);
	const eventData = getEventData(store, orgData);
	const participantData = getParticipantData(store, orgData);
	const checkInData = getCheckInData(store, eventData, participantData);
	return {
		...orgData,
		...eventData,
		...participantData,
		...checkInData
	};
}
