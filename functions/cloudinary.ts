import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => ({
    statusCode: 200,
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        message: 'Hello World',
    }),
});
