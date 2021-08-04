import moment from 'moment';
import {
    GroupByKeys,
    ReportQueryOptions,
    ReportResponse,
    ReportType,
    TranslateToKey,
} from '../elasticSearch.interfaces';
import { DefaultElasticSearchResponse } from './convertor.interface';
export interface ReturnType {
    query: any;
    from: number;
    size: number;
    groupBy: string;
}

const getDefaultGroupBy = (reportType: ReportType): GroupByKeys[] => {
    switch (reportType) {
        case ReportType.CAMPAIGN:
            return [GroupByKeys.timestamp, GroupByKeys.appowner_id, GroupByKeys.campaign_id];
        case ReportType.CONTENT:
            return [GroupByKeys.timestamp, GroupByKeys.appowner_id, GroupByKeys.content_id];
        case ReportType.CONTENT:
            return [GroupByKeys.timestamp, GroupByKeys.appowner_id, GroupByKeys.ad_tag_id];
        default:
            return [];
    }
};

const getGroupBy = (query: ReportQueryOptions, reportType: ReportType): string => {
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

    return finalGroupByArray
        .reduce((arr: string[], key: GroupByKeys) => {
            arr.push(TranslateToKey[key]);
            return arr;
        }, [])
        .join('+');
};

export const transformQueryParams = (options: ReportQueryOptions): ReturnType => {
    const { dateFrom, dateTo, appowner_id, campaign_id, demand_type, page, size } = options;

    let query: any = {};
    if (dateFrom && dateTo) {
        // Timestamp query if from and to are valid
        query['range'] = {
            timestamp: {
                gt: moment(dateFrom).toDate(),
                lt: moment(dateTo).toDate(),
            },
        };
    }
    if (appowner_id || campaign_id || demand_type) {
        const fields = [];
        const multiMatchQuery = [];
        if (appowner_id) {
            multiMatchQuery.push(appowner_id);
            fields.push('appowner_id');
        }
        if (campaign_id) {
            multiMatchQuery.push(campaign_id);
            fields.push('campaign_data.campaign_id');
        }
        if (demand_type) {
            multiMatchQuery.push(demand_type);
            fields.push('demand_type');
        }
        query['multi_match'] = {
            query: multiMatchQuery.join(' '),
            fields,
        };
    }
    if (Object.keys(query).length > 1) {
        query = {
            bool: {
                filter: Object.keys(query).map((key) => ({
                    [key]: query[key],
                })),
            },
        };
    }
    const groupBy = getGroupBy(options, ReportType.CAMPAIGN);
    const toUseSize = +size || 10;
    const from = toUseSize * (+page || 0);
    return { query, from, size: toUseSize, groupBy };
};

export const transformElasticSearchOutput = (response: DefaultElasticSearchResponse): ReportResponse => {
    return {
        remainingDocuments: response.grouped_by_app_owner_id?.sum_other_doc_count,
        documents: response.grouped_by_app_owner_id?.buckets.map((bucket) => {
            const source = bucket?.top_docs?.hits?.hits?.[0]?._source;

            const clicks_count = bucket.clicks_stats.sum;
            const impressions_count = bucket.impressions_stats.sum;
            const requests_count = bucket.requests_stats.sum;
            const revenue_count = bucket.revenue_stats.sum;
            const conversion_count = bucket.conversion_stats.sum;
            const CTR = (clicks_count / impressions_count) * 1000;
            const eCPM = impressions_count / (revenue_count * 1000);

            return {
                timestamp: source?.timestamp,
                // TODO: change the below keys
                content_id: source?.campaign_data?.campaign_id,
                content_name: source?.campaign_data?.campaign_name,
                content_type: source?.campaign_data?.campaign_name,
                campaign_id: source?.campaign_data?.campaign_id,
                campaign_name: source?.campaign_data?.campaign_name,
                appowner_id: source?.appowner_id,
                // TODO: Change the below by fixing the schema
                appowner_name: source?.appowner_id + ' name',
                demand_type: source?.demand_type,
                revenue_count,
                impressions_count,
                requests_count,
                conversion_count,
                clicks_count,
                CTR: CTR,
                eCPM: eCPM,
            };
        }),
    };
};
