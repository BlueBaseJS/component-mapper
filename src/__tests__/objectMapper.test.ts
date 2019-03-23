import { objectMapper } from '../';

describe('Utils', () => {
	describe('objectMapper', () => {
		it('should map a simple object', () => {
			const src = {
				foo: 5,
				fzz: 10,
			};

			const output = objectMapper(src, { bar: 'foo', baz: 'fzz', brr: 'faz' });

			const expected = {
				bar: 5,
				baz: 10,
			};

			expect(output).toMatchObject(expected);
		});

		it('should ignore an undefined value', () => {
			const src = {
				foo: undefined,
				fzz: 10,
			};

			const output = objectMapper(src, { bar: 'foo', baz: 'fzz' });

			const expected = { baz: 10 };

			expect(output).toMatchObject(expected);
		});

		it('should map function prop', () => {
			// Use case:
			// We have to map an external lib to match our internal api for button
			// External lib has an onClick event, that send required value on param.target
			// Our internal api understands onPress event, with value in param.value
			const src = {
				baz: 'bar',
				foo: false,
				hello: 'world',
				label: 'Submit',
				onClick: (event: any) => `${event.target} Clicks`,
			};

			const fields = {
				children: 'label',
				onPress: (props: typeof src) => {
					// Return a onPress function
					return (onPressParam: any) => props.onClick({ target: onPressParam.value });
				},
			};

			const output = objectMapper(src, fields, { rest: true, ignore: ['hello'] });

			expect(output.children).toBe('Submit');
			expect(output.onPress({ value: 5 })).toBe('5 Clicks');

			// Rest
			expect(output.baz).toBe('bar');
			expect(output.foo).toBe(false);
		});

		it('should use default props', () => {
			const src = {
				foo: undefined,
				fzz: 10,
			};

			const output = objectMapper(
				src,
				{ bar: 'foo', baz: 'fzz' },
				{ defaultProps: { baz: 5, boo: false } }
			);

			const expected = { baz: 10, boo: false };

			expect(output).toMatchObject(expected);
		});

		it('should use ignore props', () => {
			const src = {
				foo: undefined,
				fzz: 10,
			};

			const output = objectMapper(
				src,
				{ bar: 'foo', baz: 'fzz' },
				{
					defaultProps: { baz: 5, boo: false },
					ignore: ['bar', 'boo'],
				}
			);

			const expected = { baz: 10 };

			expect(output).toMatchObject(expected);
		});
	});
});
