import { computed, signal } from 'usignal';
import { getOrCreate } from '@src/util.js';
import { loadStore } from '../entity.js';
import {
	getEvents,
	getEventsById,
	getEventsByYear,
	getPastEvents,
	getUpcomingEvents
} from './event.js';
import { getOrg, getOrgEvent } from './org.js';

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
	const org = getOrg(store);
	const orgEvent = getOrgEvent(store);
	const events = getEvents(store, { org });
	const eventsById = getEventsById(events);
	const pastEvents = getPastEvents(events);
	const upcomingEvents = getUpcomingEvents(events);
	const eventsByYear = getEventsByYear(events);
	const eventYears = getEventsByYear(eventsByYear);
	return {
		org,
		orgEvent,
		events,
		eventsById,
		pastEvents,
		upcomingEvents,
		eventsByYear,
		eventYears
	};
}

async function _compute(orgId) {
	const store$ = await storeToSignal(orgId);
	const org$ = computed(() => getOrg(store$.value));
	const orgEvent$ = computed(() => getOrgEvent(store$.value));
	const events$ = computed(() => getEvents(store$.value, { org: org$.value }));
	const eventsById$ = computed(() => getEventsById(events$.value));
	const pastEvents$ = computed(() => getPastEvents(events$.value));
	const upcomingEvents$ = computed(() => getUpcomingEvents(events$.value));
	const eventsByYear$ = computed(() => getEventsByYear(events$.value));
	const eventYears$ = computed(() => getEventsByYear(eventsByYear$.value));
}

async function storeToSignal(orgId) {
	const store = await loadStore(orgId);
	const store$ = signal(store, { equals: false });
	store.data.observeDeep(() => {
		store$.value = store;
	});
	return store$;
}
