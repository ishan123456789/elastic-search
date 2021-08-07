import moment from 'moment';
import { logger } from '../../../utils/logger';
import {
    AppSchema,
    GroupByKeys,
    ReportQueryOptions,
    ReportType,
    TransformKey,
    TranslateToGroupByKey,
    ReportResponse,
} from '../elasticSearch.interfaces';
import { DefaultElasticSearchResponse } from './convertor.interface';
export interface ReturnType {
    query?: any;
    after: any;
    size: number;
    groupBy: any;
}

const getDefaultGroupBy = (reportType: ReportType): GroupByKeys[] => {
    switch (reportType) {
        case ReportType.CAMPAIGN:
            return [GroupByKeys.timestamp, GroupByKeys.appowner_id, GroupByKeys.campaign_id];
        case ReportType.CONTENT:
            return [GroupByKeys.timestamp, GroupByKeys.appowner_id, GroupByKeys.content_id];
        case ReportType.ADTAG:
            return [GroupByKeys.timestamp, GroupByKeys.appowner_id, GroupByKeys.ad_tag_id];
        default:
            return [];
    }
};

const getGroupBy = (query: ReportQueryOptions, reportType: ReportType): Array<{ [key: string]: any }> => {
    let groupBy: GroupByKeys[] = [];
    if (query.groupBy) {
        groupBy = query.groupBy.split(',') as GroupByKeys[];
    }
    const defaultGroupByValue = getDefaultGroupBy(reportType);
    defaultGroupByValue.map((value) => {
        if (groupBy.find((incomingValue) => incomingValue === value)) {
            groupBy.splice(groupBy.indexOf(value), 1);
        }
    });
    const finalGroupByArray = defaultGroupByValue.concat(groupBy.slice(0, groupBy.length));

    return finalGroupByArray.reduce((arr: any[], key: GroupByKeys) => {
        arr.push(TranslateToGroupByKey[key]);
        return arr;
    }, []);
};

export const transformQueryParams = (options: ReportQueryOptions): ReturnType => {
    const {
        dateFrom,
        dateTo,
        appowner_id,
        campaign_id,
        demand_type,
        ad_tag_id,
        ad_type,
        content_id,
        content_type,
        size,
        after_key,
        reportType,
    } = options;
    const filters = { appowner_id, campaign_id, demand_type, ad_tag_id, ad_type, content_id, content_type };
    const query = {
        bool: {
            filter: [] as any[],
        },
    };

    query.bool.filter.push({
        range: {
            timestamp: {
                gte: moment(dateFrom).toDate(),
                lte: moment(dateTo).toDate(),
            },
        },
    });

    Object.keys(TransformKey).map((key) => {
        if ((filters as any)[key]) {
            query.bool.filter.push({
                match: {
                    [(TransformKey as any)[key]]: (options as any)[key],
                },
            });
        }
    });

    const groupBy = getGroupBy(options, reportType);
    const toUseSize = +size || 10;
    const after = (() => {
        try {
            if (!after_key) return '';
            if (typeof JSON.parse(after_key) === 'string') return JSON.parse(JSON.parse(after_key));
            else return JSON.parse(after_key);
        } catch (err) {
            logger.error({ err }, 'Error while parsing after_key');
            return '';
        }
    })();

    return { query, after: after, size: toUseSize, groupBy };
};

export const transformElasticSearchOutput = (response: DefaultElasticSearchResponse): ReportResponse => {
    logger.debug({ response: JSON.stringify(response) }, 'response from elastic search');
    return {
        after_key: JSON.stringify(response.grouped_values.after_key),
        documents: response.grouped_values?.buckets.map((bucket) => {
            const source = bucket?.top_docs?.hits?.hits?.[0]?._source as unknown as AppSchema;

            const clicks_count = bucket.clicks_stats.value;
            const impressions_count = bucket.impressions_stats.value;
            const requests_count = bucket.requests_stats.value;
            const revenue_count = bucket.revenue_stats.value;
            const conversion_count = bucket.conversion_stats.value;
            const first_quarter = bucket.first_quarter_stats.value;
            const mid_point = bucket.mid_point_stats.value;
            const third_quarter = bucket.third_quarter_stats.value;
            const pause = bucket.pause_stats.value;
            const complete = bucket.complete_stats.value;
            const skip = bucket.skip_stats.value;

            const CTR = (clicks_count / impressions_count) * 1000;
            const eCPM = impressions_count / (revenue_count * 1000);

            return {
                timestamp: source?.timestamp,
                content_name: source?.content_data?.content_name,
                content_type: source?.content_data?.content_type,
                content_id: source?.content_data?.content_id,

                campaign_id: source?.campaign_data?.campaign_id,
                campaign_name: source?.campaign_data?.campaign_name,

                ad_tag_id: source?.ad_tag_data?.ad_tag_id,
                tag_name: source?.ad_tag_data?.tag_name,
                ad_type: source?.ad_tag_data?.ad_type,

                appowner_id: source?.appowner_id,
                appowner_name: source?.appowner_name,
                demand_type: source?.demand_type,
                revenue_count,
                impressions_count,
                requests_count,
                conversion_count,
                clicks_count,
                CTR: CTR,
                eCPM: eCPM,

                first_quarter,
                mid_point,
                third_quarter,
                pause,
                complete,
                skip,
            };
        }),
    };
};
