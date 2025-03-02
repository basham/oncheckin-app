import { format, isAfter, isFuture, isPast, isToday, parseISO } from 'date-fns';
import { getOrCreate, sortDesc } from '@src/util.js';
import { components } from '../components.js';

const DEFAULT_NAME = '(Event)';
const INVALID_DATE = new Date(NaN);
const PATH = 'events';

export function getEventData(store, orgData) {
	const events = getEvents(store, orgData);
	const eventsById = getEventsById(events);
	const pastEvents = getPastEvents(events);
	const upcomingEvents = getUpcomingEvents(events);
	const eventsByYear = getEventsByYear(events);
	const eventYears = getEventYears(eventsByYear);
	return {
		events,
		eventsById,
		pastEvents,
		upcomingEvents,
		eventsByYear,
		eventYears
	};
}

function getEvents(store, orgData) {
	const events = store.getEntities()
		.map((entity) => getEvent(entity, orgData))
		.filter((event) => event)
	const eventCount = getEventCount(store, events);
	return events
		.sort(sortDesc('dateObj'))
		.map((event, i) => {
			const count = eventCount - i;
			return { ...event, count };
		});
}

function getEvent(entity, orgData) {
	const event = entity.get(components.event);
	if (!event) {
		return;
	}
	const date = event.date;
	if (!date) {
		return;
	}
	const { id } = entity;
	const dateObj = parseISO(date);
	const displayDate = format(dateObj, 'PP');
	const displayDateMedium = format(dateObj, 'E, MMM d');
	const displayDateLong = format(dateObj, 'E, PP');
	const year = format(dateObj, 'y');
	const name = event.name.trim() || DEFAULT_NAME;
	const url = `${orgData.org.url}${PATH}/${id}/`;
	return {
		id,
		date,
		dateObj,
		displayDate,
		displayDateMedium,
		displayDateLong,
		name,
		url,
		year
	};
}

function getEventCount(store, events) {
	const entity = store.getEntity(components.org, components.event);
	if (!entity) {
		return events.length;
	}
	const count = entity.get(components.count);
	const date = count.date ? parseISO(count.date) : INVALID_DATE;
	const countAfter = events
		.filter(({ dateObj }) => isAfter(dateObj, date))
		.length;
	return count.value + countAfter;
}

function getEventsById(events) {
	const entries = events.map((e) => [e.id, e]);
	return new Map(entries);
}

function getPastEvents(events) {
	return events.filter(({ dateObj }) => !isToday(dateObj) && isPast(dateObj));
}

function getUpcomingEvents(events) {
	return events
		.filter(({ dateObj }) => isToday(dateObj) || isFuture(dateObj))
		.reverse();
}

function getEventsByYear(events) {
	return events.reduce((map, event) => {
		const { year } = event;
		const yearEvents = getOrCreate(map, year, () => []);
		yearEvents.unshift(event);
		return map;
	}, new Map());
}

function getEventYears(eventsByYear) {
	return [...eventsByYear.keys()].sort().reverse();
}
