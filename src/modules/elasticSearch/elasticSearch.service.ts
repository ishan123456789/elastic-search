import { generateRecords } from '../../utils/generateRecords';
import { logger } from '../../utils/logger';
import { AppSchema, APP_INDEX_KEY } from './elasticSearch.interfaces';
import { bulkInsertHelper, elasticSearchClient } from './elasticSearchClient';

export class ElasticSearchService {
    static async getAllRecords(): Promise<Array<AppSchema>> {
        await elasticSearchClient.indices.refresh({ index: APP_INDEX_KEY });
        const { body } = await elasticSearchClient.search({
            index: APP_INDEX_KEY,
            body: {
                // query: {
                //     match: {},
                // },
            },
        });
        return body?.hits || [];
    }
    static async generateAndPersistRecords(numberOfRecords: number, batches?: number): Promise<number> {
        const startedAt = Date.now();
        const { body: { count: initialCount } = {} } = await elasticSearchClient.count({
            index: APP_INDEX_KEY,
        });
        const records = generateRecords(initialCount, +numberOfRecords);
        logger.debug(`To Insert records count ${numberOfRecords}`);
        // logger.debug(records, 'To Insert records'); // Uncomment when record count is low
        await elasticSearchClient.bulk({
            body: bulkInsertHelper(APP_INDEX_KEY, records),
        });
        await elasticSearchClient.indices.refresh({ index: APP_INDEX_KEY });
        const {
            body: { count },
        } = await elasticSearchClient.count({
            index: APP_INDEX_KEY,
        });
        const timeTaken = Math.floor((Date.now() - startedAt) / 1000);
        logger.debug('Total records increased to ' + count);
        logger.debug(`Took ${timeTaken} seconds`);
        logger.debug((batches && `Expected total time: ${timeTaken * batches}`) || '');
        return count;
    }
}
