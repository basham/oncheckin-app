import { Store } from '@src/api/computed/store.js';

export async function get({ data }) {
	const { org } = data;
	const { json } = await Store(org.id);
	return { json, download: true };
}
