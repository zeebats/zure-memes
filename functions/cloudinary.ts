import { Handler } from '@netlify/functions';
import { ResourceApiResponse, v2 as cloudinary } from 'cloudinary';

const getCloudinaryList = (): Promise<ResourceApiResponse> => cloudinary.api.resources({
    prefix: 'memes',
    tags: true,
    type: 'upload',
}, (error, results) => results);

export const handler: Handler = async () => {
    const list = await getCloudinaryList();

    return {
        body: JSON.stringify(list),
        headers: {
            'Content-Type': 'application/json',
        },
        statusCode: 200,
    };
};
