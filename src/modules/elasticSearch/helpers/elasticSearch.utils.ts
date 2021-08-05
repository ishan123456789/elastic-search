import moment from 'moment';
import {
    AppSchema,
    CampaignReportResponse,
    GroupByKeys,
    ReportQueryOptions,
    ReportType,
    TransformKey,
    TranslateToGroupByKey,
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
        case ReportType.ADTAG:
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
            arr.push(TranslateToGroupByKey[key]);
            return arr;
        }, [])
        .join('+');
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
        page,
        size,
        reportType,
    } = options;
    const filters = { appowner_id, campaign_id, demand_type, ad_tag_id, ad_type, content_id, content_type };
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
    if (appowner_id || campaign_id || demand_type || ad_tag_id || ad_type || content_id || content_type) {
        const fields: string[] = [];
        const multiMatchQuery: string[] = [];
        Object.keys(TransformKey).map((key) => {
            if ((filters as any)[key]) {
                multiMatchQuery.push((options as any)[key]);
                fields.push((TransformKey as any)[key]);
            }
        });

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
    const groupBy = getGroupBy(options, reportType);
    const toUseSize = +size || 10;
    const from = toUseSize * (+page || 0);
    return { query, from, size: toUseSize, groupBy };
};

export const transformElasticSearchOutput = (response: DefaultElasticSearchResponse): CampaignReportResponse[] => {
    console.debug({ response: JSON.stringify(response) }, 'response from elastic search');
    return response.grouped_by_app_owner_id?.buckets.map((bucket) => {
        const source = bucket?.top_docs?.hits?.hits?.[0]?._source as unknown as AppSchema;

        const clicks_count = bucket.clicks_stats.sum;
        const impressions_count = bucket.impressions_stats.sum;
        const requests_count = bucket.requests_stats.sum;
        const revenue_count = bucket.revenue_stats.sum;
        const conversion_count = bucket.conversion_stats.sum;
        const first_quarter = bucket.first_quarter_stats.sum;
        const mid_point = bucket.mid_point_stats.sum;
        const third_quarter = bucket.third_quarter_stats.sum;
        const pause = bucket.pause_stats.sum;
        const complete = bucket.complete_stats.sum;
        const skip = bucket.skip_stats.sum;

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
    });
};
