import { isAfter, isBefore, parseISO, sub } from 'date-fns';
import { getOrCreate, sortAsc } from '@src/util.js';
import { components } from '../components.js';

const INVALID_DATE = new Date(NaN);
const READY_FOR_NAME_COUNT = 6;
const RETURNERS_TIME_PERIOD = { months: 2 };

export function getCheckInData(source) {
	const { store, eventsById, participants } = source;
	const indexes = getCheckInIndexes(store);

	const aEntries = participants
		.map((p) => [p.id, getParticipantCheckIns(store, eventsById, indexes, p)]);
	const checkInsByParticipantId = new Map(aEntries);

	const bEntries = aEntries
		.map(([pid, checkIns]) => checkIns)
		.flat()
		.map((checkIn) => [checkIn.id, checkIn]);
	const checkInsById = new Map(bEntries);

	const cEntries = [...eventsById.keys()]
		.map((eid) => {
			const pidSet = indexes.byEventId.get(eid) || new Set();
			const pids = [...pidSet.values()]
				.map((pid) => store.encodeId(pid, eid))
				.map((id) => checkInsById.get(id))
				.sort(sortAsc((checkIn) => checkIn.participant.displayName));
			return [eid, pids];
		});
	const checkInsByEventId = new Map(cEntries);

	return {
		...source,
		checkInsById,
		checkInsByEventId,
		checkInsByParticipantId
	};
}

function getCheckInIndexes(store) {
	const byCheckInId = new Map();
	const byEventId = new Map();
	const byParticipantId = new Map();

	for (const entity of store.getEntities()) {
		if (entity.has(components.rel) && entity.has(components.attends)) {
			const { source: pid, target: eid } = entity.get(components.rel);
			byCheckInId.set(entity.id, entity);
			getOrCreate(byEventId, eid, () => new Set()).add(pid);
			getOrCreate(byParticipantId, pid, () => new Set()).add(eid);
		}
	}

	return { byCheckInId, byEventId, byParticipantId };
}

function getParticipantCheckIns(store, eventsById, indexes, participant) {
	const eventIds = indexes.byParticipantId.get(participant.id);
	if (!eventIds?.size) {
		return [];
	}

	let attendsCount = getInitAttendsCount(store, eventIds, eventsById, participant);
	let organizesCount = getInitOrganizesCount(store, eventIds, eventsById, participant, indexes);
	let lastEvent = null;

	return [...eventIds]
		.map((eid) => eventsById.get(eid))
		.sort(sortAsc(({ count }) => count))
		.map((event) => {
			const id = store.encodeId(participant.id, event.id);
			const entity = indexes.byCheckInId.get(id);
			const host = entity.has(components.organizes);
			attendsCount += 1;
			organizesCount += host ? 1 : 0;
			const runCount = attendsCount;
			const hostCount = organizesCount;
			const url = `${event.url}check-ins/${participant.id}/edit/`;
			const specialRunCount = isSpecial(runCount);
			const specialHostCount = host && isSpecial(hostCount);
			const readyForNaming = runCount >= READY_FOR_NAME_COUNT && !participant.alias;
			const returnersCutoffDate = sub(event.dateObj, RETURNERS_TIME_PERIOD);
			const specialLastEventDate =
				lastEvent ? isBefore(lastEvent.dateObj, returnersCutoffDate) : false;
			const checkIn = {
				id,
				event,
				eventId: event.id,
				participant,
				participantId: participant.id,
				host,
				hostCount,
				runCount,
				url,
				hostCount,
				readyForNaming,
				runCount,
				specialHostCount,
				specialRunCount,
				specialLastEventDate,
				lastEvent
			};
			lastEvent = event;
			return checkIn;
		})
		.reverse();
}

function getInitAttendsCount(store, eventIds, eventsById, participant) {
	const entity = store.getEntity(participant.id, components.attends);
	if (!entity) {
		return 0;
	}
	const count = entity.get(components.count);
	const date = count.date ? parseISO(count.date) : INVALID_DATE;
	const countAfter = [...eventIds]
		.map((eid) => eventsById.get(eid))
		.filter(({ dateObj }) => isAfter(dateObj, date))
		.length;
	return count.value + countAfter - eventIds.size;
}

function getInitOrganizesCount(store, eventIds, eventsById, participant, indexes) {
	const entity = store.getEntity(participant.id, components.organizes);
	if (!entity) {
		return 0;
	}
	const organizes = [...eventIds]
		.filter((eid) => {
			const checkInId = store.encodeId(participant.id, eid);
			return indexes.byCheckInId.get(checkInId).has(components.organizes);
		});
	const count = entity.get(components.count);
	const date = count.date ? parseISO(count.date) : INVALID_DATE;
	const countAfter = organizes
		.map((eid) => eventsById.get(eid))
		.filter(({ dateObj }) => isAfter(dateObj, date))
		.length;
	return count.value + countAfter - organizes.length;
}

function isSpecial(value) {
	return value > 0 && /(0|5|69)$/.test(value);
}
