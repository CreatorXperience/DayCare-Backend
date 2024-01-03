import winston from "winston";

let connection_logger = winston.createLogger({
    level: "info",
    transports: [
        new winston.transports.Console(),
    ],
})


export {connection_logger}

