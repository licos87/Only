import './styles/index.scss';

import React from 'react';

import { Text } from '@shared/ui';
import HistoryTimeline from '@widgets/history-timeline';

import styles from './App.module.scss';

const App = () => {
	return (
		<main className={styles.app}>
				<Text
					tag="h1"
					className={styles.title}
				>
					Исторические даты
				</Text>
			<HistoryTimeline />
		</main>
	);
};

export default App;
