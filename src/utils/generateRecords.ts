import moment from 'moment';
import { AdType, AppSchema, ContentType, DemandType } from '../modules/elasticSearch/elasticSearch.interfaces';

const maxAppOwnerCount = 1;
const maxCampaignCount = 10;
const maxContentIds = 100;
const maxAdTagIds = 1000;

const maxCount = 10 ** 6;

export const randomIntegerToStartIdsWith = 1111;
// Generates a number between 0 to n
const genRandomNumber = (upto: number) => Math.floor(Math.random() * upto || 10);

export const getCurrentId = (count: number, max: number): string =>
    Math.floor((count * max) / maxCount) + max + randomIntegerToStartIdsWith + '';

export const getDemandType = (): DemandType => {
    return genRandomNumber(100) > 90 ? DemandType.PROGRAMMATIC : DemandType.DIRECT;
};

const generateRecord = (count: number): AppSchema => {
    return {
        timestamp: moment().subtract(genRandomNumber(100), 'days').toDate(),
        appowner_id: getCurrentId(count, maxAppOwnerCount),
        demand_type: getDemandType(),
        requests: genRandomNumber(100000) + '',
        campaign_data: {
            campaign_id: getCurrentId(count, maxCampaignCount),
            campaign_name: `campaign ${getCurrentId(count, maxCampaignCount)}`,
        },
        content_data: {
            content_id: getCurrentId(count, maxContentIds),
            content_name: `Web series EP ${getCurrentId(count, maxContentIds)}`,
            content_type: genRandomNumber(100) > 50 ? ContentType.LIVE : ContentType.VOD,
        },
        ad_tag_data: {
            ad_tag_id: getCurrentId(count, maxAdTagIds),
            tag_name: `automobile tag ${getCurrentId(count, maxAdTagIds)}`,
            ad_type: Object.values(AdType)[genRandomNumber(2)],
        },
        impressions: genRandomNumber(10000),
        clicks: genRandomNumber(1000),
        conversion: genRandomNumber(100),
        revenue: genRandomNumber(10000),
    };
};
export const generateRecords = (count: number): Array<AppSchema> => {
    const N = process.env.ORDERS_PERSISTED_AT_ONCE || 1;
    return Array(N)
        .fill(null)
        .map((_, i) => generateRecord(count + i));
};
