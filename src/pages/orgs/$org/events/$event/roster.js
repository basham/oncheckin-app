import { format, isBefore, sub } from 'date-fns';
import { Store } from '@src/api/computed/store.js';

export async function get({ data }) {
	const { org, event } = data;
	const h1 = event.name;
	const h2 = 'Roster';
	const lastEventCutoffDate = sub(event.dateObj, { months: 12 });
	const returnersCutoffDate = sub(event.dateObj, { months: 2 });
	const returnersCutoff = format(returnersCutoffDate, 'MM/dd');
	const {
		participants: allParticipants,
		checkInsByEventId,
		checkInsByParticipantId
	} = await Store(org.id);
	const checkIns = checkInsByEventId.get(event.id).map((checkIn) => [
		checkIn.participant.id,
		checkIn,
	]);
	const checkInsMap = new Map(checkIns);
	const participantsPromises = allParticipants.map(async (p) => {
		const checkIn = checkInsMap.get(p.id);
		const checkedIn = !!checkIn;
		const participantCheckIns = checkInsByParticipantId.get(p.id)
			.filter((checkIn) => isBefore(checkIn.event.dateObj, event.dateObj));
		const lastCheckIn = participantCheckIns[0];
		const lastEvent = lastCheckIn?.event;
		const lastEventDate = lastEvent
			? format(lastEvent.dateObj, 'MM/dd/yy')
			: '';
		const highlightLastEventDate =
			lastEvent && isBefore(lastEvent.dateObj, returnersCutoffDate);
		const lastEventCutoff =
			lastEvent && isBefore(lastEvent.dateObj, lastEventCutoffDate);
		const latestCheckIn = checkIn || lastCheckIn || {};
		const { hostCount = 0 } = latestCheckIn;
		const runCount = latestCheckIn.runCount + (checkedIn ? 0 : 1);
		const specialHostCount = !!latestCheckIn.specialHostCount && checkedIn && checkIn.host;
		const specialRunCount = isSpecial(runCount);
		const readyForNaming = runCount >= 5 && !p.alias;
		return {
			...p,
			checkIn,
			checkedIn,
			highlightLastEventDate,
			latestCheckIn: checkIn || lastCheckIn,
			lastCheckIn,
			lastEventCutoff,
			lastEventDate,
			hostCount,
			runCount,
			specialHostCount,
			specialRunCount,
			readyForNaming
		};
	});
	const participants = (await Promise.all(participantsPromises))
		.filter(
			({ checkedIn, lastCheckIn, lastEventCutoff }) => checkedIn || (lastCheckIn && !lastEventCutoff)
		)
		.sort((a, b) => {
			if (a.checkIn?.host && !b.checkIn?.host) {
				return -1;
			}
			if (!a.checkIn?.host && b.checkIn?.host) {
				return 1;
			}
			if (a.checkedIn && !b.checkedIn) {
				return -1;
			}
			if (!a.checkedIn && b.checkedIn) {
				return 1;
			}
			if (a.alias && !b.alias) {
				return -1;
			}
			if (!a.alias && b.alias) {
				return 1;
			}
			return 0;
		});
	const template = { h1, h2, returnersCutoff, participants };
	return { template };
}

function isSpecial(value) {
	return value > 0 && (value % 5 === 0 || /69$/.test(value));
}
