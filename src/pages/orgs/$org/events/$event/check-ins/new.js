import {
	createCheckIn,
	createParticipant
} from '@src/api.js';
import { Store } from '@src/api/computed/store.js';

export async function get({ data }) {
	const { org, event } = data;
	const h1 = event.name;
	const h2 = 'New check-in';
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
	const participants = allParticipants.map((p) => {
		const checkIn = checkInsMap.get(p.id);
		const checkedIn = !!checkIn;
		const latestCheckIn = checkInsByParticipantId.get(p.id)[0]
		return {
			...p,
			checkIn,
			checkedIn,
			latestCheckIn
		};
	});
	const template = { h1, h2, participants };
	return { template };
}

export async function post({ data, request }) {
	const { org, event } = data;
	const formData = await request.formData();
	const checkInType = formData.get('checkInType');
	let participantId = formData.get('selectedParticipant');
	if (checkInType === 'new-participant') {
		const personName = formData.get('fullName');
		const memberName = formData.get('alias');
		const participant = await createParticipant(org.id, { personName, memberName });
		participantId = participant.id;
	}
	const organizes = formData.get('host');
	await createCheckIn(org.id, participantId, event.id, { organizes });
	return { redirect: event.url };
}
