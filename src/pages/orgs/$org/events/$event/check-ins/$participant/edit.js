import { deleteCheckIn, setCheckIn } from '@src/api.js';
import { Store } from '@src/api/computed/store.js';
import { encodeCheckInId } from '@src/api/util.js';

export async function get({ data }) {
	const { org, event, participant } = data;
	const h1 = event.name;
	const h2 = 'Edit check-in';
	const { checkInsById } = await Store(org.id);
	const id = encodeCheckInId(participant.id, event.id);
	const checkIn = checkInsById.get(id);
	const template = { h1, h2, checkIn };
	return { template };
}

export async function post({ data, request }) {
	const { org, event, participant } = data;
	const formData = await request.formData();
	const action = formData.get('action');
	if (action === 'edit') {
		const organizes = formData.get('host');
		await setCheckIn(org.id, participant.id, event.id, { organizes });
	}
	if (action === 'delete') {
		await deleteCheckIn(org.id, participant.id, event.id);
	}
	return { redirect: event.url };
}
