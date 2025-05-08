import { z } from 'zod';

const COMPONENT = Symbol('component');
const TAG = Symbol('tag');
const ids = new Set();

const schemas = {
	date: z.string().date(),
	id: z.string().cuid2().or(z.enum(ids)),
	tag: z.literal(0).default(0),
	text: z.string().trim().min(1),
	textOptional: z.string().trim().optional(),
};

export const components = createComponents({
	attends: schemas.tag,
	banned: schemas.tag,
	count: z.object({
		date: schemas.date,
		value: z.number().int().nonnegative()
	}),
	event: z.object({
		name: schemas.text,
		date: schemas.date
	}),
	member: z.object({
		name: schemas.text
	}),
	org: z.object({
		name: schemas.text,
		shortName: schemas.textOptional,
		location: schemas.textOptional,
		url: z.string().url().optional()
	}),
	organizes: schemas.tag,
	person: z.object({
		name: schemas.text,
		notes: schemas.textOptional,
		location: schemas.textOptional
	}),
	rel: z.object({
		source: z.string(),
		target: z.string()
	})
});

function createComponents(source) {
	const entries = Object.entries(source)
		.map(([id, schema]) => {
			ids.add(id);
			const type = schema === schemas.tag ? TAG : COMPONENT;
			return [id, Object.freeze({ id, schema, type })];
		});
	return Object.fromEntries(entries);
}

export function isIdValid(value) {
	return schemas.id.safeParse(value).success;
}

export function isComponent(value) {
	return components[value?.id] === value;
}

export function isTag(item) {
	return item?.type === TAG;
}
