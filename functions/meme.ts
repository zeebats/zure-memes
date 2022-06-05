import { Handler, HandlerEvent } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

import { getImages } from '@/utilities/images';
import { getMemes } from '@/utilities/memes';
import { getTags } from '@/utilities/tags';

const {
    SUPABASE_KEY,
    SUPABASE_URL,
} = process.env;

const $supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const handler: Handler = async ({ queryStringParameters }: HandlerEvent) => {
    try {
        const { query } = queryStringParameters || {};

        if (!query) {
            throw new Error('Ben je contextueel gehandicapt ofzo');
        }

        const tagIds = await getTags({
            $supabase,
            query,
        });

        const imageIds = await getMemes({
            $supabase,
            tagIds,
        });

        const urls = await getImages({
            $supabase,
            imageIds,
        });

        return {
            body: JSON.stringify(urls),
            headers: { 'Content-Type': 'application/json' },
            statusCode: 200,
        };
    } catch ({ message }) {
        return {
            body: JSON.stringify({ message }),
            headers: { 'Content-Type': 'application/json' },
            statusCode: 500,
        };
    }
};
