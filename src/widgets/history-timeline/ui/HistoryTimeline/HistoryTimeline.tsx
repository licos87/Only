import type { HistoryCategory, HistoryEvent } from '@shared/types/history';



import React, { useCallback, useEffect, useRef, useState } from 'react';



import { gsap } from 'gsap';



import { ApiPath } from '@shared/constants/apiPath';
import { useFetch } from '@shared/hooks';
import CategoryWheel from '@widgets/category-wheel';
import Slider from '@widgets/slider';



import styles from './HistoryTimeline.module.scss';


function HistoryTimeline() {
	const [activeCategory, setActiveCategory] = useState<number>(1);
	const [events, setEvents] = useState<HistoryEvent[]>([]);
	const [showSlider, setShowSlider] = useState<boolean>(true);
	const sliderRef = useRef<HTMLDivElement>(null);

	const activeCategoryData = useFetch<HistoryCategory>(
		ApiPath.CATEGORY_EVENTS.replace(':categoryId', String(activeCategory)),
	).data;

	const activeEvents = activeCategoryData?.events;

	const activeCategoryHandler = (categoryId: number) =>
		setActiveCategory(categoryId);

	const animateExit = useCallback(() => {
		gsap.to(sliderRef.current, {
			opacity: 0,
			duration: 0.4,
			ease: 'power2.inOut',
		});
	}, []);

	const animateEnter = useCallback(() => {
		gsap.fromTo(
			sliderRef.current,
			{ opacity: 0, y: 0 },
			{ opacity: 1, y: -5, duration: 0.4, ease: 'power2.inOut' },
		);
	}, []);

	useEffect(() => {
		if (activeEvents) {
			animateExit();

			const timeout = setTimeout(() => {
				setEvents(activeEvents);
				setShowSlider(false);

				setTimeout(() => {
					animateEnter();
					setShowSlider(true);
				}, 0);
			}, 600);

			return () => clearTimeout(timeout);
		}
	}, [activeEvents, animateEnter, animateExit]);

	return (
		<section className={styles.content}>
			<CategoryWheel
				onPointClick={activeCategoryHandler}
				activeCategoryData={activeCategoryData}
			/>

			{activeCategoryData && showSlider && (
				<div
					ref={sliderRef}
				>
					<Slider cards={events} />
				</div>
			)}
		</section>
	);
}

export default HistoryTimeline;
