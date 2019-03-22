export type ObjectMapperField = string | ((...params: any[]) => any);

export interface Fields {
	[src: string]: ObjectMapperField;
}

export interface ObjectMapperOptions {
	/**
	 * Default Props. These props will be used, if no prop is defined
	 */
	defaultProps?: {
		[src: string]: any;
	};

	/**
	 * Ignore these props
	 */
	ignore?: string[];

	/**
	 * Use the rest of the props
	 */
	rest?: boolean;
}

/**
 * Example 1:
 *
 * mapObject({ foo: 'bar' })
 */
export function objectMapper(obj: any, fields: Fields, options?: ObjectMapperOptions) {
	const { defaultProps, ignore, rest }: ObjectMapperOptions = {
		defaultProps: {},
		ignore: [],
		rest: false,
		...options,
	};

	const newObj: any = {};
	const restObj: any = {};

	// Do the mapping magic here
	Object.keys(fields).forEach(destKey => {
		// src fields key or thunk
		const src = fields[destKey];

		let value;

		// If src is a string, then it represents a key in the input object.
		// Check if said key does in fact exist in the object
		if (typeof src === 'string' && obj[src]) {
			// We have resolved the value here
			value = obj[src];
		}

		// If src is a function, then it is a thunk.
		if (typeof src === 'function' && src) {
			// Resolve the thunk and use the returned data as value
			value = src(obj, fields);
		}

		// After everything, if the value is still undefined, then skip this key
		if (value === undefined) {
			return;
		}

		// Set the value in the final object
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
		...defaultProps,
		...restObj,
		...newObj,
	};
}

export type foo = Partial<Fields>;
