import { Errback } from "express";
import winston from "winston";

const error = (err: Errback)=> {
    const errorLogger = winston.createLogger({
        level:"error",
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({filename: "errorlogger.log"})
        ],
    })
errorLogger.error(err)
}


export default error