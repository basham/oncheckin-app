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

	function encodeId(...idParts) {
		return getId(idParts);
	}

	function getEntity(...idParts) {
		const id = getId(idParts);
		const entity = data.get(id);
		return loadEntity(id, entity);
	}

	function getEntities() {
		return [...data.entries()]
			.map(([id, value]) => loadEntity(id, value))
			.filter((entity) => entity);
	}

	function loadEntity(id, value) {
		if (!value) {
			return;
		}

		function _delete(component) {
			validateComponent(component);
			value.delete(component.id);
		}

		function get(component) {
			validateComponent(component);
			return value.get(component.id);
		}

		function has(component) {
			validateComponent(component);
			return value.has(component.id);
		}

		function set(component, componentValue) {
			validateComponent(component);
			const _componentValue = component.schema.parse(componentValue);
			value.set(component.id, _componentValue);
		}

		return { delete: _delete, get, has, id, set, value };
	}

	return {
		...store,
		data,
		id,
		createEntity,
		deleteEntity,
		encodeId,
		getEntity,
		getEntities,
	};
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
