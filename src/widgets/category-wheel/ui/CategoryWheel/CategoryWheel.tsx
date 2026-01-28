import type { HistoryCategory } from '@shared/types/history';
import type { PropsWithChildren } from 'react';

import React, { useCallback, useEffect, useRef } from 'react';

import { gsap } from 'gsap';

import AnimatedNumber from '@features/animated-number';
import { Text } from '@shared/ui';

import styles from './CategoryWheel.module.scss';

const DOT_CENTER = 1.5;

interface CircleButtonsProps {
	numPoints?: number;
	radius?: number;
	activeCategoryData: HistoryCategory | null;
	onPointClick: (index: number) => void;
}

export default function CategoryWheel({
	numPoints = 6,
	radius = 265,
	activeCategoryData,
	onPointClick,
}: PropsWithChildren<CircleButtonsProps>) {
	const containerRef = useRef<HTMLDivElement>(null);
	const innerRef = useRef<HTMLDivElement>(null);
	const [activeIndex, setActiveIndex] = React.useState<number>(0);

	const activeStartYear =
		activeCategoryData?.events[0]?.year ?? new Date().getFullYear();
	const activeEndYear =
		activeCategoryData?.events.at(-1)?.year ?? new Date().getFullYear();

	const angleStep = (2 * Math.PI) / numPoints;
	const offsetAngle = Math.PI / -3;
	const targetAngle = offsetAngle;

	const handleClick = useCallback(
		(index: number) => {
			setActiveIndex(index);
			onPointClick(index + 1);

			if (innerRef.current && containerRef.current) {
				const currentAngle = index * angleStep + offsetAngle;
				const rotation = (-(currentAngle - targetAngle) * 180) / Math.PI;

				gsap
					.timeline()
					.to(innerRef.current, {
						rotation: rotation % 360,
						duration: 0.8,
						ease: 'power2.inOut',
						transformOrigin: `${radius}px ${radius}px`,
					})
					.to(
						`.${styles.dot}`,
						{
							rotation: -rotation % 360,
							duration: 0.8,
							ease: 'power2.inOut',
						},
						0,
					);
			}
		},
		[
			radius,
			onPointClick,
			setActiveIndex,
			angleStep,
			offsetAngle,
			targetAngle,
		],
	);

	const handleClickNext = useCallback(() => {
		const nextIndex = (activeIndex + 1) % numPoints;
		handleClick(nextIndex);
	}, [activeIndex, numPoints, handleClick]);

	const handleClickPrev = useCallback(() => {
		const prevIndex = (activeIndex - 1 + numPoints) % numPoints; // Циклично
		handleClick(prevIndex);
	}, [activeIndex, numPoints, handleClick]);

	useEffect(() => {
		const ctx = gsap.context(() => {
			if (innerRef.current) {
				gsap.set(innerRef.current, { rotation: 0 });
			}
		}, containerRef);

		return () => ctx.revert();
	}, []);

	return (
		<div
			ref={containerRef}
			className={styles.circle}
		>
			<div className={styles.numbersContainer}>
				<AnimatedNumber
					from={new Date().getFullYear()}
					to={activeStartYear}
					duration={1.8}
				/>

				<AnimatedNumber
					className={styles.rangeEnd}
					from={new Date().getFullYear()}
					to={activeEndYear}
					duration={1.8}
				/>
			</div>

			<div className={styles.outerCircle}>
				<Text
					tag="h3"
					className={styles.categoryName}
				>
					{activeCategoryData?.category}
				</Text>
				<div
					ref={innerRef}
					className={styles.innerContainer}
				>
					{Array.from({ length: numPoints }).map((_, i) => {
						const angle = i * angleStep + offsetAngle;
						const cx = radius - DOT_CENTER;
						const cy = radius - DOT_CENTER;
						const x = cx + radius * Math.cos(angle);
						const y = cy + radius * Math.sin(angle);

						return (
							<button
								key={i}
								className={`${styles.dot} data-${i} ${activeIndex === i ? styles.active : ''}`}
								onClick={() => handleClick(i)}
								style={{
									left: `${x}px`,
									top: `${y}px`,
								}}
								title={`Point ${i}`}
							>
								<span>
									<span>{i + 1}</span>
								</span>
							</button>
						);
					})}
				</div>
			</div>
			<div className={styles.navButtons}>
				<span
					className={styles.count}
				>{`0${activeIndex + 1}/0${numPoints}`}</span>
				<div>
					<button
						className={styles.navBtn}
						onClick={handleClickPrev}
						aria-label="Previous"
					>
						<svg
							viewBox="0 0 6 8"
							fill="none"
						>
							<path
								d="M4.53918 0.707093L1.41418 3.83209L4.53918 6.95709"
								stroke="currentColor" // Наследует color от button
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
					<button
						className={styles.navBtn}
						onClick={handleClickNext}
						aria-label="Next"
					>
						<svg
							viewBox="0 0 6 8"
							fill="none"
						>
							<path
								d="M1.46082 0.707093L4.58582 3.83209L1.46082 6.95709" // Зеркальная для →
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}
