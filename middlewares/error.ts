import { NextFunction, Request, Response } from "express";
import winston from "winston";

const error = (err: any)=> {
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