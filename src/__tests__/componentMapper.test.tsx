import React from 'react';
import TestRenderer from 'react-test-renderer';
import { componentMapper } from '../';

type ButtonProps = any;

interface ThirdPartyButtonProps {
	children: React.ReactNode,
	primary: boolean,
	mini: boolean,
	disabled: boolean,
}

const ThirdPartyButton = (props: ThirdPartyButtonProps) => (
	<div>{JSON.stringify(props)}</div>
);

describe('componentMapper', () => {

	test(`should render BlueBaseApp`, () => {

		const Button: React.ComponentType<ButtonProps> = componentMapper(ThirdPartyButton, {
			children: 'children',
			disabled: 'disabled',
			mini: (props: ButtonProps) => props.size === 'small',
			primary: (props: ButtonProps) => props.color === 'primary',
		});

		const rendered = TestRenderer.create(
			<Button color="secondary" disabled={true} size="small">
				Hello
			</Button>
		);

		const jsonStr = (rendered as any).toJSON().children.join();
		const json = JSON.parse(jsonStr);
		expect(json).toMatchObject({
			children: 'Hello',
			disabled: true,
			mini: true,
			primary: false,
		});
	});

});
