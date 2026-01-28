import type { SwiperRef } from 'swiper/react';

import React, { useCallback, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import type { HistoryEvent } from '@shared/types/history';

import { Text } from '@shared/ui';

import styles from './Slider.module.scss';

interface SliderProps {
	cards: HistoryEvent[];
}

const Slider = ({ cards }: SliderProps) => {
	const swiperRef = useRef<SwiperRef>(null);
	const prevRef = useRef<HTMLButtonElement>(null);
	const nextRef = useRef<HTMLButtonElement>(null);

	const updateSwiper = useCallback(() => {
		if (!swiperRef.current?.swiper) return;
		(swiperRef.current.swiper as any).params.navigation.prevEl =
			prevRef.current;
		(swiperRef.current.swiper as any).params.navigation.nextEl =
			nextRef.current;
		swiperRef.current.swiper.navigation.destroy();
		swiperRef.current.swiper.navigation.init();
		swiperRef.current.swiper.navigation.update();
	}, []);

	useEffect(() => {
		updateSwiper();

		const handleResize = () => setTimeout(updateSwiper, 100);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [updateSwiper]);

	return (
		<div className={styles.container}>
			<Swiper
				ref={swiperRef}
				className={styles.swiper}
				modules={[Navigation, Pagination]}
				initialSlide={0}
				pagination={{ clickable: true }}
				grabCursor={true}
				slidesPerView="auto"
				breakpoints={{
					320: {
						spaceBetween: 25,
						centeredSlidesBounds: true,
						centeredSlides: true,
					},
					768: {
						spaceBetween: 50,
						pagination: false,
					},
					1440: {
						spaceBetween: 80,
						pagination: false,
					},
				}}
			>
				{cards.map((card) => (
					<SwiperSlide
						key={card.id}
						className={styles.slide}
					>
						<div className={styles.card}>
							<Text
								tag="h2"
								className={styles.year}
							>
								{card.year}
							</Text>
							<Text
								tag="p"
								className={styles.description}
							>
								{card.description}
							</Text>
						</div>
					</SwiperSlide>
				))}
			</Swiper>

			<div className={styles.nav}>
				<button
					ref={prevRef}
					className={`${styles.navBtn} ${styles.prev}`}
					aria-label="Предыдущий"
					onClick={() => swiperRef.current?.swiper?.slidePrev()}
				>
					<svg
						width="8"
						height="12"
						viewBox="0 0 8 12"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M0.707092 0.707093L5.70709 5.70709L0.707093 10.7071"
							stroke="#3877EE"
							strokeWidth="2"
						/>
					</svg>
				</button>

				<button
					ref={nextRef}
					className={`${styles.navBtn} ${styles.next}`}
					aria-label="Следующий"
					onClick={() => swiperRef.current?.swiper?.slideNext()}
				>
					<svg
						width="8"
						height="12"
						viewBox="0 0 8 12"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M0.707092 0.707093L5.70709 5.70709L0.707093 10.7071"
							stroke="#3877EE"
							strokeWidth="2"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};

export default Slider;
