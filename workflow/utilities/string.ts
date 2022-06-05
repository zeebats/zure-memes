import filenamifyUrl from 'filenamify-url';

export const createFilename = (url: string): string => filenamifyUrl(url, { replacement: '-' });
