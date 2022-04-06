import MiniSearch from 'minisearch';
import memes from '../data/memes';

const miniSearch = new MiniSearch({
    fields: ['filename', 'title', 'keywords'],
    storeFields: ['filename'],
    searchOptions: {
        fuzzy: 0.2,
    },
});

miniSearch.addAll(memes);

export const handler = async ({ queryStringParameters }) => {
    if (!('q' in queryStringParameters)) {
        return {
            statusCode: 422,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'No query found! Use \'?q={query}\' to pass your search query.',
            }),
        };
    }

    const results = miniSearch.search(queryStringParameters.q);

    return {
        body: JSON.stringify(results),
        headers: {
            'Content-Type': 'application/json',
        },
        statusCode: 200,
    };
};
