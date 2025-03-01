import { components } from '../components.js';

const DEFAULT_NAME = '(Organization)';
const PATH = 'orgs';

export function getOrg(store) {
	const { id } = store;
	const entity = store.getEntity(components.org);
	const { name = DEFAULT_NAME } = entity.get(components.org) || {};
	const url = `/${PATH}/${id}/`;
	const openUrl = `${url}open/`;
	const inviteCode = self.btoa(JSON.stringify({ id, name }));
	const shareUrl = `${self.location.origin}/?join=${inviteCode}`;
	return {
		id,
		inviteCode,
		name,
		openUrl,
		shareUrl,
		url,
	};
}

export function getOrgEvent(store) {
	return store.getEntity(components.org, components.event);
}
