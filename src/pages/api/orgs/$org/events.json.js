import { Store } from '@src/api/computed/store.js';

export async function get({ data }) {
	const { org } = data;
	const { events: json } = await Store(org.id);
	return { json };
}
