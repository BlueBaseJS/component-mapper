export type ObjectMapperField<T> = string | ((object: T, fields: Fields<T>) => any);

export interface Fields<T> {
	[src: string]: ObjectMapperField<T>;
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
export function objectMapper<T = any>(obj: T, fields: Fields<T>, options?: ObjectMapperOptions) {
	const { defaultProps, ignore, rest }: ObjectMapperOptions = {
		defaultProps: {},
		ignore: [],
		rest: false,
		...options,
	};

	const newObj: any = {};
	const restObj: any = {};

	//////////////////////////
	// Create Mapped Object //
	//////////////////////////
	Object.keys(fields).forEach(destKey => {
		// src fields key or thunk
		const src = fields[destKey];

		let value;

		// If src is a string, then it represents a key in the input object.
		// Check if said key does in fact exist in the object
		if (typeof src === 'string' && (obj as any)[src] !== undefined) {
			// We have resolved the value here
			value = (obj as any)[src];
		}

		// If src is a function, then it is a thunk.
		if (typeof src === 'function' && src) {
			// Resolve the thunk and use the returned data as value
			value = src({ ...defaultProps, ...obj }, fields);
		}

		// After everything, if the value is still undefined, then skip this key
		if (value === undefined) {
			return;
		}

		// Set the value in the final object
		newObj[destKey] = value;
	});

	/////////////////////////////
	// Add "rest" of the props //
	/////////////////////////////
	if (rest === true) {
		const inputKeys = Object.values(fields).filter(x => typeof x === 'string');

		Object.keys(obj).forEach(key => {
			if (inputKeys.indexOf(key) < 0 && ignore.indexOf(key) < 0) {
				restObj[key] = (obj as any)[key];
			}
		});
	}

	////////////////////////////
	// Construct final object //
	////////////////////////////
	const result = {
		...defaultProps,
		...restObj,
		...newObj,
	};

	//////////////////////////
	// Remove ignored props //
	//////////////////////////
	ignore.forEach(key => {
		delete result[key];
	});

	return result;
}
