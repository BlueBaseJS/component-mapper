export type ObjectMapperField = string | ((...params: any[]) => any);

export interface Fields {
	[src: string]: ObjectMapperField;
}

export interface FieldsInternal {
	[src: string]: ObjectMapperField;
}

export interface ObjectMapperOptions {
	rest?: boolean;
	ignore?: string[];
}
/**
 * Example 1:
 *
 * mapObject({ foo: 'bar' })
 */
export function objectMapper(obj: any, fields: Fields, options?: ObjectMapperOptions) {
	const { ignore, rest }: ObjectMapperOptions = {
		ignore: [],
		rest: false,
		...options,
	};

	const newObj: any = {};
	const restObj: any = {};

	// Do the mapping magic here
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

	// Find rest props
	if (rest === true) {
		const inputKeys = Object.values(fields).filter(x => typeof x === 'string');

		Object.keys(obj).forEach(key => {
			if (inputKeys.indexOf(key) < 0 && ignore.indexOf(key) < 0) {
				restObj[key] = obj[key];
			}
		});
	}

	return {
		...restObj,
		...newObj,
	};
}

export type foo = Partial<Fields>;
