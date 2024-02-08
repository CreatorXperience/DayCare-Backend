import http from "http"
import { app } from ".."
import {Server} from "socket.io"

const socketConnection = ()=> {
    let httpServer = http.createServer(app)

    let io  = new Server(httpServer, {
     cors: {
    origin: "http://localhost:3000"
    }
    })

io.on("connection", ()=>{
  console.log("connected to io server")
})

return httpServer
}

export default socketConnection