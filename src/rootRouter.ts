import Router from 'koa-router';

// Health endpoint for readniess prove (public).
const rootRouter = new Router();
rootRouter.get('healthz', (ctx) => (ctx.body = 'Service is healthy')).get('/', (ctx) => (ctx.body = 'Service working'));
export const rootRoutes = rootRouter.routes();
