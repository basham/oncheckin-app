import { sortAsc } from '@src/util.js';
import { components } from '../components.js';

const DEFAULT_NAME = '(Participant)';

export function getParticipantData(store, orgData) {
	const participants = getParticipants(store, orgData);
	const participantsById = getParticipantsById(participants);
	return {
		participants,
		participantsById
	};
}

function getParticipants(store, orgData) {
	return store.getEntities()
		.map((entity) => getParticipant(store, entity, orgData))
		.filter((participant) => participant)
		.sort(sortAsc('displayName'));
}

function getParticipant(store, entity, orgData) {
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
	const url = `${orgData.org.url}participants/${id}/`;
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
