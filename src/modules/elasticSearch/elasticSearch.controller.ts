import { Context } from 'koa';
import { generateRecords } from '../../utils/generateRecords';
import { logger } from '../../utils/logger';
import { APP_INDEX_KEY } from './elasticSearch.interfaces';
import { ElasticSearchService } from './elasticSearch.service';
import { bulkInsertHelper, elasticSearchClient } from './elasticSearchClient';

export class ElasticSearchController {
    static async getContent(ctx: Context): Promise<void> {
        try {
            ctx.body = await ElasticSearchService.getAllRecords();
        } catch (err) {
            logger.error({ err }, 'Error while getting records');
        }
    }
    static async persistContent(ctx: Context): Promise<void> {
        try {
            const { count: numberOfRecords } = ctx.query;
            const processedAtOnceThreshold = 5000;

            if (!+numberOfRecords || +numberOfRecords < processedAtOnceThreshold) {
                console.log('numberOfRecords2', numberOfRecords);
                const count = await ElasticSearchService.generateAndPersistRecords(+numberOfRecords);
                logger.info('Total records increased to ' + count);
                ctx.body = { totalRecordsNow: count };
            } else {
                let toInsertRecords = +numberOfRecords;
                console.log('Else');
                ctx.body = `Batch processing has started check logs for more info`;
                (async () => {
                    let batches = Math.ceil(+numberOfRecords / processedAtOnceThreshold);
                    while (toInsertRecords > 1) {
                        const count = await ElasticSearchService.generateAndPersistRecords(
                            Math.min(processedAtOnceThreshold, toInsertRecords),
                            batches,
                        );
                        logger.info(`Count now ${count}`);
                        toInsertRecords = toInsertRecords - processedAtOnceThreshold;
                        logger.info('Pending records ' + toInsertRecords);
                        batches--;
                    }
                })();
            }
        } catch (err) {
            logger.error({ err }, 'Error while create bulk records');
            ctx.throw('Error while bulk persisting');
        }
    }
}
