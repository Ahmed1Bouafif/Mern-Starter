import { Server } from "socket.io"
export let io

export function init(httpServer) {
  return (io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  }))
}
export function getIO() {
  if (!io) {
    throw new Error("Socket.io is not initialized")
  }
  return io
}
