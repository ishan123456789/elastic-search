import { ElasticSearchController } from '../elasticSearch.controller';

describe('ElasticSearchController', () => {
    it('Tests getContent', async () => {
        const ctx: any = {
            body: null,
        };
        await ElasticSearchController.getContent(ctx);
        expect(ctx.body).toEqual([]);
    });
});
