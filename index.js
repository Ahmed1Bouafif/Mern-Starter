import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import { init } from "./socket-io.js"
const app = express()
app.use(bodyParser.json({ limit: "200mb" }))
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }))
app.use(cors({ credentials: true, sameSite: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const MONGODB_URL = "mongodb+srv://ahmedbob:jemCUlMQhaXwLLLT@cluster0.b7e9h.mongodb.net/tradeaccounts?retryWrites=true&w=majority"

const port = 8000
const server = app.listen(port, () => console.log(`server running on port ${port}`))
mongoose
  .connect(MONGODB_URL)
  .then(server)
  .catch((err) => {
    console.log(`${err} did not connect`)
  })
export const io = init(server)

let onlineUsers = []
const addOnlineUser = (uid, sid) => {
  if (!onlineUsers.some(({ userId }) => userId === uid)) {
    onlineUsers.push({ userId: uid, socketId: sid })
  } else {
    let index
    if (
      onlineUsers.some(({ userId, socketId }, idx) => {
        if (userId === uid && socketId !== sid) {
          index = idx
          return true
        } else return false
      })
    ) {
      onlineUsers[index].socketId = sid
    }
  }
}
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId)
}
const getUser = (id) => {
  return onlineUsers.find((user) => user.userId === id)
}
io.on("connection", (socket) => {
  socket.on("newUserOnline", (uid) => {
    addOnlineUser(uid, socket.id)
    socket.emit("online_users", onlineUsers)
    console.log("=============Q ", onlineUsers)
  })

  socket.on("disconnect", (socket) => {
    removeUser(socket.id)
    console.log("oh he left")
  })
})
const socketIoObject = io
export default socketIoObject
