import { Client } from '@elastic/elasticsearch';
import { logger } from '../../utils/logger';
import { APP_INDEX_KEY } from './elasticSearch.interfaces';
// Export this to external file outside this module if used in different module as well
export const elasticSearchClient = new Client({
    node: process.env.ELASTIC_SEARCH_URL || 'https://localhost:9200',
});

export const bulkInsertHelper = (index: string, doc: Array<{ [key: string]: any }>): Array<any> => {
    return doc.flatMap((doc) => [{ index: { _index: index } }, doc]);
};

(async () => {
    try {
        // await elasticSearchClient.indices.delete({
        //     index: APP_INDEX_KEY,
        // });
        // await elasticSearchClient.indices.refresh({ index: APP_INDEX_KEY });

        const { body: exists } = await elasticSearchClient.indices.exists({
            index: APP_INDEX_KEY,
        });
        if (exists) {
            logger.info('Index already exists');
            return;
        }
        const result = await elasticSearchClient.indices.create({
            index: APP_INDEX_KEY,
        });
        logger.info({ result }, 'Index created');
    } catch (err) {
        logger.error({ err }, 'Error while creating index');
    }
})();
