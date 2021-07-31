export interface CampaignData {
    campaign_id: string;
    campaign_name: string;
}

export interface ContentData {
    content_id: string;
    content_name: string;
    content_type: string;
}

export enum ContentType {
    VOD = 'VOD',
    LIVE = 'LIVE',
}

export interface AdTagData {
    ad_tag_id: string;
    tag_name: string;
    ad_type: AdType;
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
    requests: string;
    campaign_data: CampaignData;
    content_data: ContentData;
    ad_tag_data: AdTagData;
    impressions: number;
    clicks: number;
    conversion: number;
    revenue: number;
}

export const APP_INDEX_KEY = 'app';
