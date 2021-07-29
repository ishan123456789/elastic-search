import Koa from 'koa';
import { KoaReqLogger } from 'koa-req-logger';

import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import helmet from 'koa-helmet';
import { Server } from 'http';
import apiRouter from './router';
import { logger, requestLogger } from './utils/logger';

export const koaLogger = new KoaReqLogger({
    pinoInstance: requestLogger,
});

const app = new Koa();

app.use(koaLogger.getMiddleware())
    .use(helmet())
    .use(bodyParser())
    .use(
        compress({
            threshold: 2048,
        }),
    )
    .use(apiRouter.routes());
const port = process.env.PORT || 1337;
logger.info(`Server running on port http://localhost:${port} 🚀`);
const server = app.listen(port);

function shutDown(app: Server): void {
    logger.info('SIGTERM signal received. Closing http server...');

    app.close(() => {
        logger.info('Http server closed.');
        process.exit(0);
        // Disconnect DB like mongo or postgres here
        // disconnect(() => {
        // process.exit(0);
        // });
    });
}
process.on('SIGTERM', () => shutDown(server)).on('SIGINT', () => shutDown(server));

export default server;
