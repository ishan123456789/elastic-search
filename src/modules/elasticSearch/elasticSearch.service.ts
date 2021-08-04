import { transformElasticSearchOutput, transformQueryParams } from './helpers/elasticSearch.utils';
import { generateRecords } from '../../utils/generateRecords';
import { logger } from '../../utils/logger';
import {
    AppSchema,
    APP_INDEX_KEY,
    ReportQueryOptions,
    CampaignReportResponse,
    ReportResponse,
} from './elasticSearch.interfaces';
import { bulkInsertHelper, elasticSearchClient } from './elasticSearchClient';

export class ElasticSearchService {
    static async getCampaignReport(options: ReportQueryOptions): Promise<ReportResponse> {
        await elasticSearchClient.indices.refresh({ index: APP_INDEX_KEY });
        const { query, from, size, groupBy } = transformQueryParams(options);
        const isGroupByDemandType = true;
        console.log('query', JSON.stringify({ query, groupBy }));
        const { body } = await elasticSearchClient.search({
            index: APP_INDEX_KEY,
            size: 0,
            body: {
                ...(Object.keys(query).length !== 0 && { query }),
                // https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-datehistogram-aggregation.html#date-histogram-scripts
                runtime_mappings: {
                    'timestamp.group_by': {
                        type: 'keyword',
                        // change the aggregation here to combine multiple
                        script: `emit(${groupBy})`,
                    },
                },
                aggs: {
                    grouped_by_app_owner_id: {
                        terms: {
                            field: 'timestamp.group_by',
                        },

                        aggs: {
                            // https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-top-hits-aggregation.html
                            top_docs: {
                                top_hits: {
                                    size: 1,
                                    _source: {
                                        include: [
                                            'timestamp',
                                            'campaign_data.campaign_id',
                                            'campaign_data.campaign_name',
                                            'appowner_id',
                                            'appowner_name',
                                            'demand_type',
                                        ],
                                    },
                                },
                            },
                            clicks_stats: {
                                stats: { field: 'clicks' },
                            },
                            conversion_stats: {
                                stats: { field: 'conversion' },
                            },
                            revenue_stats: {
                                stats: { field: 'revenue' },
                            },
                            impressions_stats: {
                                stats: { field: 'impressions' },
                            },
                            requests_stats: {
                                stats: { field: 'requests' },
                            },
                            bucket_paginate: {
                                bucket_sort: {
                                    from,
                                    size,
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
