import { Context, DefaultState } from 'koa';
import Router from 'koa-router';
import { ElasticSearchController } from './elasticSearch.controller';

const router = new Router<DefaultState, Context>();

router.get('/', ElasticSearchController.getContent);

export const elasticSearchRoutes = router.routes();