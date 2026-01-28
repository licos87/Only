import React, { useEffect, useRef } from 'react';

import classnames from 'classnames';
import { gsap } from 'gsap';

import styles from './AnimatedNumber.module.scss';

interface NumberAnimatorProps {
	from: number;
	to: number;
	duration?: number;
	className?: string | undefined;
}

const AnimatedNumber: React.FC<NumberAnimatorProps> = ({
	from,
	to,
	duration = 1,
	className,
}) => {
	const displayRef = useRef<HTMLSpanElement>(null);
	const proxyRef = useRef({ value: from });

	useEffect(() => {
		gsap.to(proxyRef.current, {
			value: to,
			duration,
			ease: 'power2.out',
			onUpdate: () => {
				if (displayRef.current) {
					displayRef.current.textContent = String(
						Math.round(proxyRef.current.value),
					);
				}
			},
		});
	}, [to, duration, from]);

	return (
		<span
			ref={displayRef}
			className={classnames(styles.number, className)}
		>
		</span>
	);
};

export default AnimatedNumber;
