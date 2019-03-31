import React from 'react';
import TestRenderer from 'react-test-renderer';
import { componentMapper } from '../';

type ButtonProps = {
	children: React.ReactNode,
	color: 'primary' | 'secondary',
	size: 'small' | 'normal' | 'large',
	disabled: boolean,
};

interface ThirdPartyButtonProps {
	children: React.ReactNode,
	primary: boolean,
	mini: boolean,
	disabled: boolean,
}

const ThirdPartyButton = ({ children, ...rest }: ThirdPartyButtonProps) => (
	<div {...rest}>{children}</div>
);

describe('componentMapper', () => {

	test(`should map ThirdPartyButton to Button`, () => {

		const Button: React.ComponentType<ButtonProps> =
		componentMapper<ButtonProps, ThirdPartyButtonProps>(ThirdPartyButton, {
			children: 'children',
			disabled: 'disabled',
			mini: (props) => props.size === 'small',
			primary: (props) => props.color === 'primary',
		});

		const rendered = TestRenderer.create(
			<Button color="secondary" disabled={true} size="small">
				Hello world!
			</Button>
		);

		const jsonStr = (rendered as any).toJSON();

		expect(jsonStr.props).toMatchObject({
			disabled: true,
			mini: true,
			primary: false,
		});
		expect(jsonStr.children.join()).toBe('Hello world!');
	});

	test(`should use a custom render function`, () => {

		const Button: React.ComponentType<ButtonProps> =
		componentMapper<ButtonProps, ThirdPartyButtonProps>(
			ThirdPartyButton,
			{
				children: 'children',
				disabled: 'disabled',
				mini: (props) => props.size === 'small',
				primary: (props) => props.color === 'primary',
			}, {
				render: (props, Component) => {

					const { children, ...rest } = props;
					return (
						<Component {...rest}>
						 <div data-testID="wrapper" style={{ backgroundColor: 'red' }}>
							 {children}
						 </div>
						</Component>
					);
				}
			}
		);

		const rendered = TestRenderer.create(
			<Button color="secondary" disabled={true} size="small">
				Hello
			</Button>
		);

		expect((rendered.toJSON() as any).children[0].props['data-testID']).toBe('wrapper');
		expect((rendered.toJSON() as any).children[0].children.join()).toBe('Hello');
	});

});
