export interface DefaultElasticSearchResponse {
    grouped_by_app_owner_id: GroupedByAppOwnerId;
}

export interface GroupedByAppOwnerId {
    doc_count_error_upper_bound: number;
    sum_other_doc_count: number;
    buckets: Bucket[];
}

export interface Bucket {
    key: string;
    doc_count: number;
    top_docs: TopDocs;
    conversion_stats: ConversionStats;
    requests_stats: RequestsStats;
    revenue_stats: RevenueStats;
    clicks_stats: ClicksStats;
    impressions_stats: ImpressionsStats;
}

export interface TopDocs {
    hits: Hits;
}

export interface Hits {
    total: Total;
    max_score: number;
    hits: Hit[];
}

export interface Total {
    value: number;
    relation: string;
}

export interface Hit {
    _index: string;
    _type: string;
    _id: string;
    _score: number;
    _source: Source;
}

export interface Source {
    appowner_id: string;
    demand_type: string;
    timestamp: string;
    campaign_data: CampaignData;
}

export interface CampaignData {
    campaign_name: string;
    campaign_id: string;
}

export interface ConversionStats {
    count: number;
    min: number;
    max: number;
    avg: number;
    sum: number;
}

export interface RequestsStats {
    count: number;
    min: number;
    max: number;
    avg: number;
    sum: number;
}

export interface RevenueStats {
    count: number;
    min: number;
    max: number;
    avg: number;
    sum: number;
}

export interface ClicksStats {
    count: number;
    min: number;
    max: number;
    avg: number;
    sum: number;
}

export interface ImpressionsStats {
    count: number;
    min: number;
    max: number;
    avg: number;
    sum: number;
}
