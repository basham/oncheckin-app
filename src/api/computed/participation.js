import { isAfter, subYears } from 'date-fns';
import { getOrCreate } from '@src/util.js';

const ATTENDS_INDEX = 0;
const ORGANIZES_INDEX = 1;

export function getParticipationData(source) {
	const { checkInsByEventId, events } = source;
	const oneYearAgo = subYears(new Date(), 1);
	const latestEvents = events
		.filter((event) => isAfter(event.dateObj, oneYearAgo));
	const latestCheckIns = latestEvents
		.map((event) => checkInsByEventId.get(event.id))
		.flat();
	const participationByParticipant = latestCheckIns.reduce((map, checkIn) => {
		const { host, participantId } = checkIn;
		const stats = getOrCreate(map, participantId, () => [0, 0]);
		const attendsCount = stats[ATTENDS_INDEX] + 1;
		const organizesCount = stats[ORGANIZES_INDEX] + (host ? 1 : 0);
		map.set(participantId, [attendsCount, organizesCount]);
		return map;
	}, new Map());
	const participationValues = [...participationByParticipant.values()];
	const participationByType = participationValues.reduce((types, p) => {
		const attends = [...types[ATTENDS_INDEX], p[ATTENDS_INDEX]];
		const organizes = [...types[ORGANIZES_INDEX], p[ORGANIZES_INDEX]];
		return [attends, organizes];
	}, [[], []]);
	const participantCount = participationByParticipant.size;
	const attendsOne = participationValues.filter((v) => v[ATTENDS_INDEX] === 1).length;
	const attendsMax = Math.max(...participationValues.map((v) => v[ATTENDS_INDEX]));
	const organizesZero = participationValues.filter((v) => v[ORGANIZES_INDEX] === 0).length;
	const attendsMany = participantCount - attendsOne;
	const organizesMax = Math.max(...participationValues.map((v) => v[ORGANIZES_INDEX]));
	const organizesSome = participantCount - organizesZero;
	const attendsManyOrganizesZero = participationValues.filter((v) => v[ATTENDS_INDEX] > 1 && v[ORGANIZES_INDEX] === 0).length;
	const attendsIQR = interquartileRange(participationByType[ATTENDS_INDEX].filter(v => v > 1));
	const organizesIQR = interquartileRange(participationByType[ORGANIZES_INDEX].filter(v => v > 0));
	const participation = {
		participantCount,
		attendsOne,
		attendsMany,
		attendsMax,
		attendsManyOrganizesZero,
		organizesZero,
		organizesSome,
		organizesMax,
		attendsIQR,
		organizesIQR
	};
	return {
		...source,
		participation,
		participationByParticipant
	};
}

function quartile(data, q) {
	data.sort((a, b) => a - b);
	const pos = ((data.length) - 1) * q;
	const base = Math.floor(pos);
	const rest = pos - base;
	if (data[base + 1] !== undefined) {
		return data[base] + rest * (data[base + 1] - data[base]);
	} else {
		return data[base];
	}
}

function interquartileRange(data) {
	const q1 = quartile(data, 0.25);
	const q2 = quartile(data, 0.5);
	const q3 = quartile(data, 0.75);
	return [q1, q2, q3];
}
