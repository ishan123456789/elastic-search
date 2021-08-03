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

export interface ReportResponse {
    timestamp: Date;
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

export interface ReportQueryOptions {
    dateFrom: Date | string;
    dateTo: Date | string;
    appowner_id: string;
    campaign_id: string;
    demand_type: string;
    pageNumber: number;
    totalCount: number;
}
export const APP_INDEX_KEY = 'app';
