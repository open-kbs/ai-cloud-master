
export const getActions = (meta) => {
    return [

        [/\/?textToImage\("(.*)"\)/, async (match) => {
            const response = await openkbs.textToImage(match[1], { serviceId: 'stability.sd3Medium' });
            const imageSrc = `data:${response.ContentType};base64,${response.base64Data}`;
            return { type: 'SAVED_CHAT_IMAGE', imageSrc, ...meta };
        }],


        [/\/?googleSearch\("(.*)"\)/, async (match) => {
            const q = match[1];
            const searchParams = match[2] && JSON.parse(match[2]) || {};
            try {
                const noSecretsProvided = '{{secrets.googlesearch_api_key}}'.includes('secrets.googlesearch_api_key');

                const params = {
                    q,
                    ...searchParams,
                    ...(noSecretsProvided ? {} : { key: '{{secrets.googlesearch_api_key}}', cx: '{{secrets.googlesearch_engine_id}}' }),
                };

                const response = noSecretsProvided
                    ? await openkbs.googleSearch(params.q, params)
                    : await axios.get('https://www.googleapis.com/customsearch/v1', { params });

                const data = response?.map(({ title, link, snippet, pagemap }) => ({
                    title,
                    link,
                    snippet,
                    image: pagemap?.metatags?.[0]?.["og:image"]
                }));

                return { data, ...meta };

            } catch (e) {
                return { error: e.response.data, ...meta };
            }
        }],



        [/\/?webpageToText\("(.*)"\)/, async (match) => {
            try {
                let response = await openkbs.webpageToText(match[1]);

                // limit output length
                if (response?.content?.length > 5000) {
                    response.content = response.content.substring(0, 5000);
                }

                return { data: response, ...meta };
            } catch (e) {
                return { error: e.response.data, ...meta };
            }
        }],



        [/\/?documentToText\("(.*)"\)/, async (match) => {
            try {
                let response = await openkbs.documentToText(match[1]);

                // limit output length
                if (response?.text?.length > 5000) {
                    response.text = response.text.substring(0, 5000);
                }

                return { data: response, ...meta };
            } catch (e) {
                return { error: e.response.data, ...meta };
            }
        }],



        [/\/?imageToText\("(.*)"\)/, async (match) => {
            try {
                let response = await openkbs.imageToText(match[1]);

                if (response?.detections?.[0]?.txt) {
                    response = { detections: response?.detections?.[0]?.txt };
                }

                return { data: response, ...meta };
            } catch (e) {
                return { error: e.response.data, ...meta };
            }
        }],



        [/\/?textToSpeech\("(.*)"\s*,\s*"(.*)"\)/, async (match) => {
            try {
                const response = await openkbs.textToSpeech(match[2], {
                    languageCode: match[1]
                });
                return { data: response, ...meta };
            } catch (e) {
                return { error: e.response.data, ...meta };
            }
        }],


    ];
}
