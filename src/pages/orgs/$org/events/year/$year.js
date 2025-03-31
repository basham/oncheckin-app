import { Store } from '@src/api/computed/store.js';
import { getOrCreate, sortAsc } from '@src/util.js';

export async function get({ data }) {
	const { org, year } = data;
	const h1 = `Events in ${year}`;
	const { checkInsByEventId, eventsByYear } = await Store(org.id);
	const events = eventsByYear.get(year);
	const eventsByParticipantCount = events.reduce((map, event) => {
		const c = checkInsByEventId.get(event.id).length;
		const group = getOrCreate(map, c, () => []);
		group.push(event);
		map.set(c, group);
		return map;
	}, new Map());
	const participantCounts = [...eventsByParticipantCount.keys()];
	const minCount = Math.min(...participantCounts);
	const maxCount = Math.max(...participantCounts);
	const eventsWithFewestParticipants = { count: minCount, events: eventsByParticipantCount.get(minCount) };
	const eventsWithMostParticipants = { count: maxCount, events: eventsByParticipantCount.get(maxCount) };
	const participantCheckInCounts = events.reduce((map, event) => {
		const checkIns = checkInsByEventId.get(event.id);
		for (const checkIn of checkIns) {
			const id = checkIn.participantId;
			const [attendances, organizes] = getOrCreate(map, id, () => [0, 0]);
			map.set(id, [attendances + 1, organizes + (checkIn.host ? 1 : 0), checkIn.participant]);
		}
		return map;
	}, new Map());
	const attendanceValues = [...participantCheckInCounts.values()].map((item) => item[0]);
	const organizesValues = [...participantCheckInCounts.values()].map((item) => item[1]);
	const maxAttendanceValue = Math.max(...attendanceValues);
	const maxOrganizesValue = Math.max(...organizesValues);
	const mostAttendances = [...participantCheckInCounts.values()]
		.filter((item) => item[0] === maxAttendanceValue)
		.map((item) => item[2])
		.sort(sortAsc('displayName'));
	const mostOrganizes = [...participantCheckInCounts.values()]
		.filter((item) => item[1] === maxOrganizesValue)
		.map((item) => item[2])
		.sort(sortAsc('displayName'));
	const participantsWithMostAttendances = { count: maxAttendanceValue, participants: mostAttendances };
	const participantsWithMostOrganizes = { count: maxOrganizesValue, participants: mostOrganizes };
	const template = {
		h1,
		events,
		eventsWithFewestParticipants,
		eventsWithMostParticipants,
		participantsWithMostAttendances,
		participantsWithMostOrganizes
	};
	return { template };
}
