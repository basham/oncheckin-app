const raw = document.getElementById('data')?.text;
const data = raw ? JSON.parse(raw) : { route: 'index' };

export { data };
export const {
	account,
	checkIn,
	checkIns,
	checkInsByYear,
	code,
	date,
	device,
	event,
	events,
	eventsWithFewestParticipants,
	eventsWithMostParticipants,
	latestCheckIn,
	route,
	h1,
	h2,
	hares,
	org,
	orgs,
	orgEvent,
	params,
	participant,
	participants,
	participantsWithMostAttendances,
	participantsWithMostOrganizes,
	participation,
	recentEvents,
	returnersCutoff,
	runners,
	upcomingEvents,
	years,
} = data;

window.data = data;
