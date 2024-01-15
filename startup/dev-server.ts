import { connection_logger } from "../logger/connection-logger"
import {IncomingMessage,ServerResponse,Server} from "http"

const devServer = (server: Server<typeof IncomingMessage, typeof ServerResponse>, port: string)=>{
    server.listen(port, ()=>{
        connection_logger.info("Listening on port" + " "+ port)
    })
 
 server.on("error", (error:any)=>{
   if(error.message.includes("listen EADDRINUSE: address already in use :::3030")){
    server.listen(80)
   }
   else{
     console.log("Server error")
   }
 })
}

export default devServer