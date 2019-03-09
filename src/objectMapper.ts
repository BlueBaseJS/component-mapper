export type ObjectMapperField = string | ((...params: any[]) => any);

export interface Fields {
	[src: string]: ObjectMapperField;
}

export interface FieldsInternal {
	[src: string]: ObjectMapperField;
}

/**
 * Example 1:
 *
 * mapObject({ foo: 'bar' })
 */

export function objectMapper(obj: any, fields: Fields) {
	const newObj: any = {};
	// const processedFields = processMapperFields(fields);

	Object.keys(fields).forEach(destKey => {
		const src = fields[destKey];

		let value;

		if (typeof src === 'string' && obj[src]) {
			value = obj[src];
		}

		if (typeof src === 'function' && src) {
			value = src(obj, fields);
		}

		if (value === undefined) {
			return;
		}

		newObj[destKey] = value;
	});

	return newObj;
}

export type foo = Partial<Fields>;
