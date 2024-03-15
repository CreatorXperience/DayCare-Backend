import http from "http"
import { app } from ".."
import {Server} from "socket.io"
import user_signup_model from "../models/user-account-model"
import RegisteredDaycareModel from "../models/registeredDaycares"

let onlineUsers: Array<{userId: string, socketId: string}> = []

const socketConnection = ()=> {
    let httpServer = http.createServer(app)

    let io  = new Server(httpServer, {
     cors: {
    origin: "http://localhost:3000"
    }
    })

  io.on("connection", (socket)=>{
    console.log("connected to io server")

  socket.on("newUser", (user)=>{
  let  found  = onlineUsers &&  onlineUsers.some((item)=> item.userId === user)
  if(!found){
  onlineUsers.push({userId: user, socketId: socket.id})
  io.emit("onlineUsers", onlineUsers)
  }
  console.log(onlineUsers)
  })


  socket.on("newMessage" , (message: {chatId: string, message: string,senderId: string, reciever: string})=>{
    console.log(message)

    let online  =  onlineUsers.filter((user)=> user.userId === message.reciever)
    console.log(online)

    if(online[0] && online[0].socketId){
      io.to(online[0].socketId).emit("getMessage", message)
      io.to(online[0].socketId).emit("newMessageNotification", message)
    }
  
  })





  
  

  socket.on("disconnect", ()=>{
    let online = onlineUsers.filter((item) => item.socketId !== socket.id)
    onlineUsers = online
  io.emit("onlineUsers", onlineUsers)
  })
})

return httpServer
}

export default socketConnection