import filenamifyUrl from 'filenamify-url';

export const createFilename = (url: string) => filenamifyUrl(url, { replacement: '-' });
