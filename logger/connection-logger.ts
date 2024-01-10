import winston from "winston";

let connection_logger = winston.createLogger({
    level: "info",
    transports: [
        new winston.transports.Console(),
    ],
})

let exceptionRejectionLogger = ()=> {

    let  expressLogger = winston.createLogger({
        level: "info",
        transports: [
          new winston.transports.Console()
        ],
        exceptionHandlers: [
          new winston.transports.Console(),
        ],
        rejectionHandlers: [
          new winston.transports.Console()
      ]
      })
      
}

export {connection_logger, exceptionRejectionLogger}

