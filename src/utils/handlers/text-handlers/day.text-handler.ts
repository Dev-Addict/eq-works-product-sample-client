export const dayTextHandler = (item: string | null) =>
	item ? new Date(item).toLocaleDateString() : 'All Days';
