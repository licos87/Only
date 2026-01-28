export interface HistoryEvent {
	id: number;
	year: number;
	description: string;
}

export interface HistoryCategory {
	id: number;
	category: string;
	events: HistoryEvent[];
}

export interface Category { id: number; category: string };

export interface AllCategory {
	categories: Category[];
}
