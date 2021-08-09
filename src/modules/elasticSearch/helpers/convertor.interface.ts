import { AppSchema } from '../elasticSearch.interfaces';
export interface DefaultElasticSearchResponse {
    grouped_values: GroupedValues;
}

interface GroupedValues {
    after_key: AfterKey;
    buckets: Bucket[];
}

interface AfterKey {
    date: number;
    appowner_id: string;
    campaign_id: string;
}

interface Bucket {
    key: Key;
    doc_count: number;
    third_quarter_stats: Stats;
    top_docs: TopDocs;
    conversion_stats: Stats;
    mid_point_stats: Stats;
    pause_stats: Stats;
    first_quarter_stats: Stats;
    skip_stats: Stats;
    requests_stats: Stats;
    revenue_stats: Stats;
    clicks_stats: Stats;
    complete_stats: Stats;
    impressions_stats: Stats;
}

interface Key {
    date: number;
    appowner_id: string;
    campaign_id: string;
}

interface Stats {
    value: number;
}

interface TopDocs {
    hits: Hits;
}

interface Hits {
    total: Total;
    max_score: number;
    hits: Hit[];
}

interface Total {
    value: number;
    relation: string;
}

interface Hit {
    _index: string;
    _type: string;
    _id: string;
    _score: number;
    _source: AppSchema;
}

interface Stats {
    value: number;
}
