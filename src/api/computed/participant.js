import { sortAsc } from '@src/util.js';
import { components } from '../components.js';

const DEFAULT_NAME = '(Participant)';

export function getParticipantData(source) {
	const participants = getParticipants(source);
	const participantsById = getParticipantsById(participants);
	return {
		...source,
		participants,
		participantsById
	};
}

function getParticipants(source) {
	const { store } = source;
	return store.getEntities()
		.map((entity) => getParticipant(entity, source))
		.filter((participant) => participant)
		.sort(sortAsc('displayName'));
}

function getParticipant(entity, source) {
	const { store, org } = source;
	const person = entity.get(components.person);
	if (!person) {
		return;
	}
	const { id } = entity;
	const { location = '', notes = '' } = person;
	const member = entity.get(components.member) || {};
	const { name: alias = '' } = member;
	const fullName = person.name || DEFAULT_NAME;
	const displayName = alias || `Just ${fullName}`;
	const url = `${org.url}participants/${id}/`;
	const attendsCount = store.getEntity(id, components.attends)?.get(components.count);
	const organizesCount = store.getEntity(id, components.organizes)?.get(components.count);
	return {
		id,
		alias,
		displayName,
		fullName,
		location,
		notes,
		attendsCount,
		organizesCount,
		url
	};
}

function getParticipantsById(participants) {
	const entries = participants.map((p) => [p.id, p]);
	return new Map(entries);
}
