import { getOrCreate } from '@src/util.js';
import { isComponent, isIdValid } from './components.js';
import { createId, createYMap, createRemoteStore } from './store.js';

const DOC_ROOT = 'data';
const ID_DELIMITER = '|';

export async function loadStore(id = createId()) {
	const store = await createRemoteStore(id);
	const data = store.doc.getMap(DOC_ROOT);

	function createEntity(...idParts) {
		const parts = idParts.length ? idParts : [createId()];
		const id = getId(parts);
		getOrCreate(data, id, createYMap);
		return getEntity(...parts);
	}

	function deleteEntity(...idParts) {
		const id = getId(idParts);
		data.delete(id);
	}

	function getEntity(...idParts) {
		const id = getId(idParts);
		const _entity = data.get(id);

		if (!_entity) {
			return;
		}

		function _delete(component) {
			validateComponent(component);
			_entity.delete(component.id);
		}

		function get(component) {
			validateComponent(component);
			return _entity.get(component.id);
		}

		function set(component, value) {
			validateComponent(component);
			const _value = component.schema.parse(value);
			_entity.set(component.id, _value);
		}

		return { delete: _delete, get, id, set, value: _entity };
	}

	return { ...store, data, id, createEntity, deleteEntity, getEntity };
}

function getId(idParts) {
	if (!Array.isArray(idParts)) {
		throw new Error('Id parameter must be an array')
	}
	const parts = idParts.map((value) => value?.id || value)
	if (!parts.every(isIdValid)) {
		throw new Error('Invalid id');
	}
	return parts.join(ID_DELIMITER);
}

function validateComponent(component) {
	if (!isComponent(component)) {
		throw Error('Argument must be a component');
	}
}
