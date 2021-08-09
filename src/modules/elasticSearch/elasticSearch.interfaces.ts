export interface CampaignData {
    campaign_id: string;
    campaign_name: string;
}

export interface ContentData {
    content_id: string;
    content_name: string;
    content_type: ContentType;
}

export enum ContentType {
    VOD = 'VOD',
    LIVE = 'LIVE',
}

export interface AdTagData {
    ad_tag_id: string;
    tag_name: string;
    ad_type: AdType;
    ad_metrics: AdMetrics;
}

export enum AdType {
    VAST = 'VAST',
    VMAP = 'VMAP',
    VAST_PLAYLIST = 'VAST_PLAYLIST',
}

export enum DemandType {
    DIRECT = 'direct',
    PROGRAMMATIC = 'programmatic',
}

export interface AppSchema {
    timestamp: Date;
    appowner_id: string;
    appowner_name: string;
    demand_type: DemandType;
    requests: number;
    campaign_data: CampaignData;
    content_data: ContentData;
    ad_tag_data: AdTagData;
    impressions: number;
    clicks: number;
    conversion: number;
    revenue: number;
}

export interface AdMetrics {
    first_quarter: number;
    mid_point: number;
    third_quarter: number;
    pause: number;
    complete: number;
    skip: number;
}
export interface ReportResponse {
    after_key: string;
    documents: ReportResponseItem[];
}
export interface ReportResponseItem {
    timestamp: Date | string;
    campaign_id: string;
    campaign_name: string;
    appowner_id: string;
    appowner_name: string;
    demand_type: string;
    requests_count: number;
    impressions_count: number;
    clicks_count: number;
    conversion_count: number;
    revenue_count: number;
    CTR: number;
    eCPM: number;

    ad_tag_id: string;
    tag_name: string;
    ad_type: string;
    content_id: string;
    content_name: string;
    content_type: string;

    first_quarter: number;
    mid_point: number;
    third_quarter: number;
    pause: number;
    complete: number;
    skip: number;
}

export interface ReportQueryOptions {
    dateFrom: Date | string;
    dateTo: Date | string;
    appowner_id: string;
    campaign_id: string;
    demand_type: string;
    ad_tag_id: string;
    ad_type: string;
    content_id: string;
    content_type: string;
    after_key: string;
    size: number;
    groupBy: string;
    reportType: ReportType;
}
export const APP_INDEX_KEY = 'app';

export enum ReportType {
    CAMPAIGN = 'campaign',
    CONTENT = 'content',
    ADTAG = 'adtag',
}

export enum GroupByKeys {
    timestamp = 'timestamp',
    appowner_id = 'appowner_id',
    ad_tag_id = 'ad_tag_id',
    ad_type = 'ad_type',
    content_id = 'content_id',
    content_type = 'content_type',
    campaign_id = 'campaign_id',
    demand_type = 'demand_type',
}
export const TransformKey = {
    ad_tag_id: 'ad_tag_data.ad_tag_id',
    ad_type: 'ad_tag_data.ad_type',
    tag_name: 'ad_tag_data.tag_name',
    appowner_id: 'appowner_id',
    campaign_id: 'campaign_data.campaign_id',
    campaign_name: 'campaign_data.campaign_name',
    content_id: 'content_data.content_id',
    content_type: 'content_data.content_type',
    content_name: 'content_data.content_name',
    demand_type: 'demand_type',
    appowner_name: 'appowner_name',
    timestamp: 'timestamp',
};
export const TranslateToGroupByKey: { [key in GroupByKeys]: any } = {
    ad_tag_id: { ad_tag_id: { terms: { field: `${TransformKey.ad_tag_id}` } } },
    ad_type: { ad_type: { terms: { field: `${TransformKey.ad_type}` } } },
    appowner_id: { appowner_id: { terms: { field: `${TransformKey.appowner_id}` } } },
    campaign_id: { campaign_id: { terms: { field: `${TransformKey.campaign_id}` } } },
    content_id: { content_id: { terms: { field: `${TransformKey.content_id}` } } },
    content_type: { content_type: { terms: { field: `${TransformKey.content_type}` } } },
    demand_type: { demand_type: { terms: { field: `${TransformKey.demand_type}` } } },

    timestamp: {
        date: {
            date_histogram: {
                field: 'timestamp',
                calendar_interval: '1h',
            },
        },
    },
};
