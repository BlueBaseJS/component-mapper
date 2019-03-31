import { Fields, ObjectMapperOptions, objectMapper } from './objectMapper';
import React from 'react';

type ComponentMapperOptions<T = any> = ObjectMapperOptions & {
	/**
	 * Custom render logic
	 */
	render?: (props: T,  Component: React.ComponentType<T>) => React.ReactNode;
};

/**
 * A React HOC to map components
 *
 * Example 1:
 *
 * Material UI Button: <MUI.Button label="ABC" />
 * BlueBase BUtton: <BB.Components.Button>{label}</BB.Components.Button>
 *
 * So BB.Components.Button = componentMapper(MUI.Button, { label: children });
 *
 * @param Component
 * @param fields
 */
export function componentMapper<SourceProps = any, DestProps = any>
	(
		Component: React.ComponentType<DestProps>,
		fields: Fields<SourceProps>,
		options: ComponentMapperOptions<DestProps> = {}
	): React.ComponentType<SourceProps>
{

	return (props: any) => {
		const newProps: DestProps = objectMapper(props, fields, options);

		return (options.render !== undefined)
		? options.render(newProps, Component) as any
		: (<Component {...newProps} />);
	};
}