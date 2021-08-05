import { transformElasticSearchOutput, transformQueryParams } from '../elasticSearch.utils';
import { queryParamsFixture } from './queryPrams.fixture';
import { elasticSearchResponseFixture } from './response.fixture';

describe('Tests transformElasticSearchOutput', () => {
    // Check __snapshots__ folder to see if it's as expected
    it('Matches snapshot', () => {
        const result = transformElasticSearchOutput(elasticSearchResponseFixture as any);
        // Check snapshot to confirm the result is right
        expect(result).toMatchSnapshot();
    });
});

describe('Tests transformQueryParam', () => {
    it('Matches snapshot', () => {
        const result = transformQueryParams(queryParamsFixture as any);
        // Check snapshot to confirm the result is right
        expect(result).toMatchSnapshot();
    });
});
