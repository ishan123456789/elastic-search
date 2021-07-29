import pino from 'pino';
import { reqSerializer, resSerializer, errSerializer } from 'koa-req-logger';

const isDev = process.env.NODE_ENV !== 'production';

// https://getpino.io/#/docs/help?id=mapping-pino-log-levels-to-google-cloud-logging-stackdriver-serverity-levels
const PinoLevelToSeverityLookup: { [key: string]: string } = {
    trace: 'DEBUG',
    debug: 'DEBUG',
    info: 'INFO',
    warn: 'WARNING',
    error: 'ERROR',
    fatal: 'CRITICAL',
};

const defaultPinoConf = {
    messageKey: 'message',
    formatters: {
        level(label: string, number: number) {
            return {
                severity: PinoLevelToSeverityLookup[label] || PinoLevelToSeverityLookup.info,
                level: number,
            };
        },
    },
};

export function createLogger(options: pino.LoggerOptions): pino.Logger {
    return pino({ ...options, ...defaultPinoConf });
}

export const logger = createLogger({
    name: 'elastic-search-service',
    level: isDev ? 'debug' : 'info',
    enabled: !(process.env.NO_LOG == 'true'),
});

// THe types aren't updated
export const requestLogger = (logger.child as any)(
    {},
    {
        serializers: {
            req: reqSerializer,
            res: resSerializer,
            err: errSerializer,
        },
    },
);
