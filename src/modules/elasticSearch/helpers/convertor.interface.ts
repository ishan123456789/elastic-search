import { AdTagData, AppSchema, CampaignData, ContentData } from '../elasticSearch.interfaces';

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
    conversion_stats: Stats;
    requests_stats: Stats;
    revenue_stats: Stats;
    clicks_stats: Stats;
    impressions_stats: Stats;
    first_quarter_stats: Stats;
    mid_point_stats: Stats;
    third_quarter_stats: Stats;
    pause_stats: Stats;
    complete_stats: Stats;
    skip_stats: Stats;
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

export interface Source extends AppSchema {
    [x: string]: any;
}

export interface Stats {
    count: number;
    min: number;
    max: number;
    avg: number;
    sum: number;
}
