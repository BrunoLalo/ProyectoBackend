import config from '../config.js'
import winston from 'winston'

const customLevelsOptions = {

    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5
    },
    colors: {
        debug: 'white',
        http: 'violet',
        info: 'blue',
        warning: 'yellow',
        error: 'orange',
        fatal: 'red',
    }
}

const winstonLoggerDev = winston.createLogger({
    customLevelsOptions,
    transports: [
        new winston.transports.Console({
            level: "debug",
        })
    ]
})

const winstonLoggerProd = winston.createLogger({
    customLevelsOptions,
    transports: [
        new winston.transports.Console({
            level: "info",
        }),
        new winston.transports.File({
            level: "error",
            filename: 'errors.log'
        })
    ]
})

export function getLogger() {
    if (config.MODE === 'production') {
        return winstonLoggerProd
    } else {
        return winstonLoggerDev
    }
}

export const loggerInRequest = (req, res, next) => {
    req.logger = logger
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}