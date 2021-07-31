jest.mock('../elasticSearchClient');
import { ElasticSearchController } from '../elasticSearch.controller';
// import { elasticSearchClient } from '../elasticSearchClient';

describe('ElasticSearchController', () => {
    it('Tests getContent', async () => {
        expect(typeof ElasticSearchController.getContent === 'function').toBeTruthy();
    });
});
