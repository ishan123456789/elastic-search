import { Context } from 'koa';
import { logger } from '../../utils/logger';
import { ReportQueryOptions } from './elasticSearch.interfaces';
import { ElasticSearchService } from './elasticSearch.service';
import { reportQueryParamsValidator, validateRouteParam } from './elasticSearch.validator';

export class ElasticSearchController {
    static async getContent(ctx: Context): Promise<void> {
        try {
            const { count } = ctx.query;
            ctx.body = await ElasticSearchService.getAllRecords(+count);
        } catch (err) {
            logger.error({ err }, 'Error while getting records');
            ctx.throw('Error while fetching report');
        }
    }
    static async getReport(ctx: Context): Promise<void> {
        try {
            const queryParams = ctx.query;
            const { reportType } = ctx.params;
            await validateRouteParam.validate(reportType);

            await reportQueryParamsValidator.validate(queryParams, { strict: true });

            ctx.body = await ElasticSearchService.getCampaignReport({
                ...queryParams,
                reportType,
            } as unknown as ReportQueryOptions);
        } catch (err) {
            logger.error({ err }, 'Error while getting records');
            ctx.throw(err.type === 'ValidationError' ? 'Error while fetching report' : err?.message || '');
        }
    }
    static async persistContent(ctx: Context): Promise<void> {
        try {
            const { count: numberOfRecords } = ctx.query;
            const processedAtOnceThreshold = 5000;

            if (!+numberOfRecords || +numberOfRecords < processedAtOnceThreshold) {
                const count = await ElasticSearchService.generateAndPersistRecords(+numberOfRecords);
                logger.info('Total records increased to ' + count);
                ctx.body = { totalRecordsNow: count };
            } else {
                let toInsertRecords = +numberOfRecords;
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
