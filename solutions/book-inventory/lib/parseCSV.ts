// utils/parseCSV.ts
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export const parseCSV = async (filePath: string): Promise<any[]> => {
	const csvFile = fs.readFileSync(path.resolve(filePath), 'utf8');
	return new Promise<any[]>((resolve) => {
		Papa.parse(csvFile, {
			header: true,
			complete: (results) => {
				resolve(results.data);
			}
		});
	});
};
