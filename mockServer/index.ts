import type { AllCategory, Category, HistoryCategory } from '@shared/types/history';
import type { Request, Response } from 'express';



import cors from 'cors';
import express from 'express';



import { ApiPath } from '@shared/constants/apiPath';



import HistoryEvents from './response/historyEvents.json';


const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(ApiPath.MAIN, (req, res) => {
	res.send('Mock server is running.');
});

app.get(ApiPath.ALL_CATEGORY, (_: Request, res: Response<AllCategory>) => {
	const categories: Category[] = HistoryEvents.historyEvents.map((event) => ({
		id: event.id,
		category: event.category,
	}));

	res.status(200).send({ categories: categories });
});

app.get(
	ApiPath.CATEGORY_EVENTS,
	(req: Request<{ categoryId: string }>, res: Response<HistoryCategory>) => {
		const categoryId = parseInt(req.params.categoryId, 10);
		const category = HistoryEvents.historyEvents.find(
			(c) => c.id === categoryId,
		);
		if (!category) {
			return res.status(404);
		}

		res.status(200).json(category);
	},
);

app.listen(5001, '127.0.0.1', () =>
	console.log('mockServer: http://127.0.0.1:5001'),
);
