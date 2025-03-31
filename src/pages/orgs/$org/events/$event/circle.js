import { Store } from '@src/api/computed/store.js';

export async function get({ data }) {
	const { org, event } = data;
	const h1 = event.name;
	const h2 = 'Circle';
	const { checkInsByEventId } = await Store(org.id);
	const checkIns = checkInsByEventId.get(event.id);
	const template = { h1, h2, checkIns };
	return { template };
}
