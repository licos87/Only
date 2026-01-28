import { useCallback, useEffect, useRef, useState } from 'react';





interface UseFetchOptions extends RequestInit {
	enabled?: boolean;
}

export function useFetch<T>(url: string, options: UseFetchOptions = {}) {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	const optionsRef = useRef(options);

	useEffect(() => {
		optionsRef.current = options;
	}, [options]);

	const fetchData = useCallback(async () => {
		abortControllerRef.current?.abort();
		abortControllerRef.current = new AbortController();

		setLoading(true);
		setError(null);

		try {
			const res = await fetch(url, {
				signal: abortControllerRef.current.signal,
				...optionsRef.current,
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const result: T = await res.json();
			setData(result);
		} catch (err: unknown) {
			if (err instanceof DOMException && err.name !== 'AbortError')
				setError(err.message);
		} finally {
			setLoading(false);
		}
	}, [url]);

	useEffect(() => {
		if (optionsRef.current.enabled !== false) fetchData();

		return () => abortControllerRef.current?.abort();
	}, [fetchData]);

	return { data, loading, error, refetch: fetchData };
}
