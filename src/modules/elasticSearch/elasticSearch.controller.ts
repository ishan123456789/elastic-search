import { Context } from 'koa';
import { generateRecords } from '../../utils/generateRecords';
import { logger } from '../../utils/logger';
import { INDEX_KEY } from './elasticSearch.interfaces';
import { bulkInsertHelper, elasticSearchClient } from './elasticSearchClient';

export class ElasticSearchController {
    static getContent(ctx: Context): void {
        ctx.body = [];
    }
    static async persistContent(ctx: Context): Promise<void> {
        try {
            const { body: { count: initialCount } = {} } = await elasticSearchClient.count({
                index: INDEX_KEY,
            });
            const records = generateRecords(initialCount);
            console.log('records', records);
            const result = await elasticSearchClient.bulk({
                body: bulkInsertHelper(INDEX_KEY, records),
            });
            console.log(JSON.stringify(result));
            await elasticSearchClient.indices.refresh({ index: INDEX_KEY });
            const {
                body: { count },
            } = await elasticSearchClient.count({
                index: INDEX_KEY,
            });
            logger.info('Total records increased to ' + count);
            ctx.body = { totalRecordsNow: count };
        } catch (err) {
            logger.error({ err }, 'Error while create bulk records');
            ctx.throw('Error while bulk persisting');
        }
    }
}
