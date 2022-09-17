import { computeOrg } from '@src/api/org-signal.js';

export async function get({ data }) {
	const { org } = data;
	const route = `${data.route}/events`;
	const h1 = 'Events';
	const {
		upcomingEvents,
		pastEvents,
		eventYears: years,
	} = await computeOrg(org.id);
	const recentEvents = pastEvents.slice(0, 5);
	const template = { route, h1, upcomingEvents, recentEvents, years };
	return { template };
}
