import Router from 'koa-router';
import { DefaultState, Context } from 'koa';
import { elasticSearchRoutes } from './modules/elasticSearch/elasticSearch.router';
import { rootRoutes } from './rootRouter';

const apiRouter = new Router<DefaultState, Context>();
apiRouter
    // .use(authMiddleware) // Add middleware here for auth if any
    .use('/es', elasticSearchRoutes)
    .use('/', rootRoutes);

export default apiRouter;
