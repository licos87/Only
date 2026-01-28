import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react';



import { createElement, forwardRef } from 'react';



import classnames from 'classnames';



import styles from './Text.module.scss';


export interface TextProps extends HTMLAttributes<HTMLElement> {
	tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
	children: ReactNode;
	weight?: 'bold' | 'semi-bold' | 'medium' | 'regular' | 'light' | 'thin';
	theme?: 'primary' | 'secondary' | 'alert' | 'action';
	testId?: string;
}

export const Text = forwardRef<HTMLElement, TextProps>(
	(
		{
			tag,
			children,
			weight = 'regular',
			theme = 'primary',
			testId,
			className,
			...restProps
		},
		ref: ForwardedRef<HTMLElement>,
	) => {
		const textClasses = classnames(
			styles.text,
			styles[`text-${tag}`],
			weight && styles[`text-${weight}`],
			theme && styles[`text-${theme}`],
			className,
		);

		return createElement(
			tag,
			{
				ref,
				className: textClasses,
				'data-testid': testId,
				...restProps,
			},
			children,
		);
	},
);

Text.displayName = 'Text';
