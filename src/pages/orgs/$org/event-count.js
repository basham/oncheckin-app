import { setEventCount } from '@src/api.js';
import { Store } from '@src/api/computed/store.js';

export async function get({ data }) {
	const { org } = data;
	const h1 = 'Edit event count';
	const {
		orgEvent,
	} = await Store(org.id);
	const template = { h1, orgEvent };
	return { template };
}

export async function post({ data, request }) {
	const { org } = data;
	const formData = await request.formData();
	const date = formData.get('date');
	const value = parseInt(formData.get('value'));
	await setEventCount(org.id, { date, value });
	const redirect = `${org.url}settings`;
	return { redirect };
}
