import { Context } from 'koa';
import { generateRecords } from '../../utils/generateRecords';
import { logger } from '../../utils/logger';
import { APP_INDEX_KEY } from './elasticSearch.interfaces';
import { bulkInsertHelper, elasticSearchClient } from './elasticSearchClient';

export class ElasticSearchController {
    static async getContent(ctx: Context): Promise<void> {
        try {
            const { body } = await elasticSearchClient.search({
                index: APP_INDEX_KEY,
                body: {
                    // query: {
                    //     match: {},
                    // },
                },
            });
            ctx.body = body?.hits || [];
        } catch (err) {
            logger.error({ err }, 'Error while getting records');
        }
    }
    static async persistContent(ctx: Context): Promise<void> {
        try {
            const { count: numberOfRecords } = ctx.query;
            const { body: { count: initialCount } = {} } = await elasticSearchClient.count({
                index: APP_INDEX_KEY,
            });
            const records = generateRecords(initialCount, +numberOfRecords);
            logger.debug('To Insert records', records);
            await elasticSearchClient.bulk({
                body: bulkInsertHelper(APP_INDEX_KEY, records),
            });
            await elasticSearchClient.indices.refresh({ index: APP_INDEX_KEY });
            const {
                body: { count },
            } = await elasticSearchClient.count({
                index: APP_INDEX_KEY,
            });
            logger.info('Total records increased to ' + count);
            ctx.body = { totalRecordsNow: count };
        } catch (err) {
            logger.error({ err }, 'Error while create bulk records');
            ctx.throw('Error while bulk persisting');
        }
    }
}
