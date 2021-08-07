import { transformElasticSearchOutput, transformQueryParams } from './helpers/elasticSearch.utils';
import { generateRecords } from '../../utils/generateRecords';
import { logger } from '../../utils/logger';
import { AppSchema, APP_INDEX_KEY, ReportQueryOptions, ReportResponse } from './elasticSearch.interfaces';
import { bulkInsertHelper, elasticSearchClient } from './elasticSearchClient';

export class ElasticSearchService {
    static async getCampaignReport(options: ReportQueryOptions): Promise<ReportResponse> {
        await elasticSearchClient.indices.refresh({ index: APP_INDEX_KEY });
        const { query, after, size, groupBy } = transformQueryParams(options);
        logger.debug({ query, after, size, groupBy }, 'transformation result');
        const { body } = await elasticSearchClient.search({
            index: APP_INDEX_KEY,
            size: 0,
            body: {
                query,
                aggs: {
                    grouped_values: {
                        composite: {
                            size: size,
                            // Change this body
                            ...(after && {
                                after,
                            }),
                            sources: groupBy,
                        },
                        aggs: {
                            top_docs: {
                                top_hits: {
                                    size: 1,
                                    _source: {
                                        include: [
                                            'ad_tag_data.ad_tag_id',
                                            'ad_tag_data.ad_type',
                                            'ad_tag_data.tag_name',
                                            'appowner_id',
                                            'campaign_data.campaign_id',
                                            'campaign_data.campaign_name',
                                            'content_data.content_id',
                                            'content_data.content_type',
                                            'content_data.content_name',
                                            'demand_type',
                                            'demand_type',
                                            'timestamp',
                                        ],
                                    },
                                },
                            },
                            clicks_stats: {
                                sum: {
                                    field: 'clicks',
                                },
                            },
                            conversion_stats: {
                                sum: {
                                    field: 'conversion',
                                },
                            },
                            revenue_stats: {
                                sum: {
                                    field: 'revenue',
                                },
                            },
                            impressions_stats: {
                                sum: {
                                    field: 'impressions',
                                },
                            },
                            requests_stats: {
                                sum: {
                                    field: 'requests',
                                },
                            },
                            first_quarter_stats: {
                                sum: {
                                    field: 'ad_tag_data.ad_metrics.first_quarter',
                                },
                            },
                            mid_point_stats: {
                                sum: {
                                    field: 'ad_tag_data.ad_metrics.mid_point',
                                },
                            },
                            third_quarter_stats: {
                                sum: {
                                    field: 'ad_tag_data.ad_metrics.third_quarter',
                                },
                            },
                            pause_stats: {
                                sum: {
                                    field: 'ad_tag_data.ad_metrics.pause',
                                },
                            },
                            complete_stats: {
                                sum: {
                                    field: 'ad_tag_data.ad_metrics.complete',
                                },
                            },
                            skip_stats: {
                                sum: {
                                    field: 'ad_tag_data.ad_metrics.skip',
                                },
                            },
                        },
                    },
                },
            },
        });

        return transformElasticSearchOutput(body?.aggregations as any);
    }

    static async getAllRecords(size?: number): Promise<Array<AppSchema>> {
        await elasticSearchClient.indices.refresh({ index: APP_INDEX_KEY });
        const { body } = await elasticSearchClient.search({
            index: APP_INDEX_KEY,
            size: size || 100,
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
        const insertOutput = await elasticSearchClient.bulk({
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
        logger.debug((batches && `Expected total time: ${(timeTaken * batches) / 60} minutes`) || '');
        return count;
    }
}
