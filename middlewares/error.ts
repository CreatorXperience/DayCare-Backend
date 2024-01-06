import { Errback } from "express";
import winston from "winston";

const error = (err: Errback)=> {
    const errorLogger = winston.createLogger({
        level:"error",
        transports: [
            new winston.transports.Console(),
        ],
    })
errorLogger.error(err)
}


export default error