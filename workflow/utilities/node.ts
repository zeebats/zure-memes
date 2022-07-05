import { constants } from 'node:fs';
import { access } from 'node:fs/promises';

export const probe = async (path: string): Promise<boolean> => {
	try {
		await access(path, constants.R_OK | constants.W_OK);

		return true;
	} catch {
		return false;
	}
};
