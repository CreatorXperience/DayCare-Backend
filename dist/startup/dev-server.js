"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_logger_1 = require("../logger/connection-logger");
const devServer = (server, port) => {
    server.listen(port, () => {
        connection_logger_1.connection_logger.info("Listening on port" + " " + port);
    });
    server.on("error", (error) => {
        if (error.message.includes("listen EADDRINUSE: address already in use :::3030")) {
            server.listen(80);
        }
        else {
            console.log("Server error");
        }
    });
};
exports.default = devServer;
