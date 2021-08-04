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

export interface CampaignReportResponse {
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
}

export interface ReportResponse {
    remainingDocuments: number;
    documents: CampaignReportResponse[];
}
export interface ReportQueryOptions {
    dateFrom: Date | string;
    dateTo: Date | string;
    appowner_id: string;
    campaign_id: string;
    demand_type: string;
    page: number;
    size: number;
    groupBy: string;
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

export const TranslateToKey: { [key in GroupByKeys]: string } = {
    timestamp: `doc['timestamp'].value.toString('yyyy_MM_dd')`,
    ad_tag_id: `doc['ad_tag_data.ad_tag_id']`,
    ad_type: `doc['ad_tag_data.ad_type']`,
    appowner_id: `doc['appowner_id']`,
    campaign_id: `doc['campaign_data.campaign_id']`,
    content_id: `doc['content_data.content_id']`,
    content_type: `doc['content_data.content_type']`,
    demand_type: `doc['demand_type']`,
};
