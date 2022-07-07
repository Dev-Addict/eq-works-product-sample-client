import axios from 'axios';

export const request = async <T>(url: string): Promise<T | null> => {
	try {
		return (await axios.get<T>(url)).data;
	} catch (e) {
		return null;
	}
};
