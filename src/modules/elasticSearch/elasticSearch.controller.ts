import { Context } from 'koa';

export class ElasticSearchController {
    static getContent(ctx: Context): void {
        ctx.body = [];
    }
}
